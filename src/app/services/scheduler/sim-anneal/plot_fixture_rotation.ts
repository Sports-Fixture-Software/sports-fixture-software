import { Match, Team, CostsTable } from './fixture_constraints';
import { Constraint } from '../../../util/constraint_factory'

// Configuration constants
const DEFAULT_SEARCH_TIMEOUT: number = 30000; // Milliseconds before the algorithm gives up.
const MINIMUM_TEMPERATURE: number = 0.00001; // The temperature point at which the annealing stops
const ALPHA_COOLING_RATE: number = 0.99; // The proportion of the temperature removed with every iteration
const INITIAL_COOLING_FREQUENCY: number = 1000; // How many random changes must be made before the temperature is multiplied by the cooling rate. This is increased as time goes by.
const COOLFREQ_RETRY_FACTOR: number = 1.1; // The factor by which the cooling frequency is increased if an annealing failed to meet the threshold.

/**
 * plotFixture
 * 
 * Plots a fixture with enough rounds for each team to play every other at most
 * once. Uses simulated annealing until a legal solution is found.
 * 
 * Params:
 * teams: Team[] The teams playing in the season fixture. These must implement
 *               the Team interface. Must have an even number of elements (even   
 *               teams or odd teams + bye)
 * resvdMatches: Match[] The matches that are already locked in before 
 *                       generation begins. Order not needed.
 * numRounds: The number of rounds to generate.
 * verbose: boolean Set to true if you want the function to post progress to 
 *                  the console.
 * searchTimeout: number Milliseconds of time given for the search. The 
 *                       function will spread this time sparsely over the
 *                       search space. Do not set too low or the function will
 *                       not have time to find any solutions. 60000 is the 
 *                       default and should suffice unless many teams are in 
 *                       the fixture (order of 100 or more), in which case 
 *                       memory will become just as big a problem.
 * 
 * Returns:
 * Match[] A complete and legal fixture, sorted by round.
 * 
 * Throws Errors:
 * 'At least two teams are required to make a fixture.' 1 or 0 teams were in 
 *   teams parameter array.
 * 'Odd number of teams...' if there is an odd number of teams.
 * 'Reserved Matches break a constraint.' One or more of the reserved matches 
 *   break one or more constraints, on their own and cannot be used to generate 
 *   a legal fixture.
 * 'Solution could not be found...' The function ran through all the time it 
 *   had and couldn't find a solution below the threshold.
 * Helper function errors
 * CostsTable.x() errors 
 */
export function plotFixtureRotation( teams: Team[], resvdMatches: Match[], numRounds: number, verbose: boolean = false, searchTimeout: number = DEFAULT_SEARCH_TIMEOUT ): Match[] {
    
    let numTeams: number = teams.length;
    let table: CostsTable = new CostsTable(numTeams, numRounds); // The matrix used to calculate constraint costs of fixtures
    let startTime: number = Date.now();

    if( verbose ){    
        var permCounter: number = 0;
    }

    //////////////// +++++++++ Helper Functions +++++++++ ////////////////////

    /**
     * convertOneDToTwoDFixture
     * Places an unordered 1D array of matches into a new ordered 2D array of 
     * matches representing a fixture with empty round entries for empty rounds
     * and no entries for further matches. Used to process reserved matches.
     */
    function convertOneDToTwoDFixture(roundCount: number, matches: Match[]): Match[][] {
        let twoDFixture: Match[][] = new Array(roundCount);
        for( let i: number = 0; i < roundCount; i++ ){
            twoDFixture[i] = [];
        }

        // Setting reserved matches by cloning them
        let newMatch: Match;
        for( let i: number = 0; i < matches.length; i++ ){
            newMatch = new Match(matches[i].roundNum, matches[i].homeTeam, matches[i].awayTeam, true);
            twoDFixture[matches[i].roundNum].push( newMatch );
        }

        return twoDFixture;
    }

    /**
     * convertTwoDToOneDFixture
     * The inverse of convertOneDToTwoDFixture.
     * Used for returning completed fixtures. 
     */
    function convertTwoDToOneDFixture(matches: Match[][]){
        let oneDFixture: Match[] = [];
        for( let i: number = 0; i < matches.length; i++ ){
            for( let j: number = 0; j < matches[i].length; j++ ){
                oneDFixture.push( matches[i][j] );
            }
        }
        return oneDFixture;
    }

    /**
     * cloneFixture
     * Returns a recursive copy of the input fixture.
     * Used for keeping track of best solutions when restarting.
     */
    function cloneFixture(fixture: Match[][]): Match[][] {
        let newFixture: Match[][] = new Array(fixture.length);
        for( let i: number = 0; i < fixture.length; i++ ){
            newFixture[i] = new Array(fixture[i].length);
            for( let j: number = 0; j < fixture[i].length; j++ ){
                newFixture[i][j] = fixture[i][j];
            }
        }
        
        return newFixture;
    }
        
    /**
     * randomFixture
     * Generates an array of matches representing a complete fixture according  
     * to the parameters specified. This fixture incorporates the matches in 
     * the reservations array and fills out the rest of the matches randomly, 
     * enforcing only that no two matches be the same.
     * 
     * params:
     * roundCount - the number of rounds in the fixture to generate.
     * teamCount - the number of teams in the fixture to generate.
     * reservations - the matches to be incorporated into the fixture and 
     *   marked as Match.reserved = true.
     * 
     * returns:
     * An array of matches of length = roundCount * (teamCount/2), ordered by
     * round, representing a full random fixture.
     */
    function randomFixture(roundCount: number, teamCount: number, reservations: Match[] = []): Match[][] {
        let fixture: Match[][] = convertOneDToTwoDFixture(roundCount, reservations);
        
        // Filling the remaining matches in with random matches
        let newMatch: Match;
        let randHomeTeam: number;
        let randAwayTeam: number;
        let isUnique: boolean;
        for( let i: number = 0; i < fixture.length; i++ ){
            for( let j: number = fixture[i].length; j < (teamCount/2); j++ ){
                randHomeTeam = Math.floor(Math.random() * teamCount);
                randAwayTeam = Math.floor(Math.random() * teamCount);
                while( randAwayTeam == randHomeTeam ){
                    randAwayTeam = Math.floor(Math.random() * teamCount);
                }
                
                newMatch = new Match(i, randHomeTeam, randAwayTeam);
                
                // If the random match is a duplicate of any existing in this round, try again
                if( newMatch.isContainedIn(fixture[i]) ){
                    j--;
                    continue;
                }

                fixture[i].push( newMatch );
            }
        }

        return fixture;
    }

    /**
     * SwapMatch
     * Used by alterFixture to swap out a particular match during simulated 
     * annealling.
     */
    class SwapMatch {
        constructor(public match: Match, public swapIndex: number){};
    }

    /**
     * getSwapMatch
     * Finds a random, valid match that can be swapped with a match in fixture.
     * The match is returned in a SwapMatch struct so it can be swapped in 
     * precisely and when needed.
     * 
     * The match maintains uniqueness in round when swapped and will never be a 
     * match that is targeted to swap with a reserved = true match.
     * 
     * teamsCount is needed to limit the range of the return SwapMatch's 
     * swapIndex member.
     * 
     * Throws:
     * 'Could not find a match in the fixture to alter.' Either all matches 
     *   were marked as reserved in fixture or there were no unique matches to 
     *   switch for something in the fixture. If the latter occurs, there is 
     *   likely a bug lurking.
     */
    function getSwapMatch(fixture: Match[][], teamsCount: number): SwapMatch {
        // Getting intial random values
        let randMatch: Match = new Match(Math.floor(Math.random() * fixture.length),
                                         Math.floor(Math.random() * teamsCount),
                                         Math.floor(Math.random() * teamsCount));
        let randMatchNum: number = Math.floor(Math.random() * fixture[randMatch.roundNum].length);
        
        // Making sure that match uniqueness in round and teamX != teamY is enforced
        // If we have an illegal match, we iterate until we find one
        let valid: boolean = false;
        let unreserved: boolean;
        for( let i: number = 0; i < fixture.length; i++ ){ // Each round
            unreserved = false;

            // now we have to see if we can swap with an existing (non-reserved) game in the round
            for( let l: number = 0; l < fixture[randMatch.roundNum].length; l++ ){
                if( fixture[randMatch.roundNum][randMatchNum].reserved ){
                    randMatchNum++;
                    if( randMatchNum >= fixture[randMatch.roundNum].length ){
                        randMatchNum = 0;
                    }
                } else {
                    unreserved = true;
                    break;
                }
            }

            // If there are no unreserved games to swap with this round, we have to try the next round
            if( !unreserved ){
                randMatch.roundNum++;
                if( randMatch.roundNum >= fixture.length ){
                    randMatch.roundNum = 0;
                }
                continue;
            }
            
            for( let j: number = 0; j < teamsCount; j++ ){ // Each home team
                for( let k: number = 0; k < teamsCount; k++ ){ // Each away team
                    if ( randMatch.homeTeam == randMatch.awayTeam ||
                         randMatch.isContainedIn(fixture[randMatch.roundNum]) ){
                        // This match is illegal. We cannot use it.
                        randMatch.awayTeam++;
                        if( randMatch.awayTeam >= teamsCount ){
                            randMatch.awayTeam = 0;
                        }
                    } else {
                        // Valid substitute match found
                        valid = true;
                        break;
                    }
                }
                if( valid ){
                    break;
                }
                randMatch.homeTeam++;
                if( randMatch.homeTeam >= teamsCount ){
                    randMatch.homeTeam = 0;
                }
            }
            if( valid ){
                break;
            }
            randMatch.roundNum++;
            if( randMatch.roundNum >= fixture.length ){
                randMatch.roundNum = 0;
            }
        }

        if( !valid ){
            // If no valid match could be found to swap, abort.
            // This should not happen during plotFixtureRotation.
            throw new Error('Could not find a match in the fixture to alter.');
        }
        
        return new SwapMatch(randMatch,randMatchNum);
    }

    /**
     * getSwitchMatch
     * Picks a random non-reserved match in the fixture and returns a SwapMatch
     * pointing to that match with the only difference being the home and away 
     * teams switched.
     * 
     * This is used for the stage 2 simulated annealing where a narrower 
     * strategy of finding neighbouring solutions must be employed.
     * 
     * Throws:
     * 'Could not find a match in the fixture to alter.' Either all matches 
     *   were marked as reserved in fixture or there were no unique matches to 
     *   switch for something in the fixture. If the latter occurs, there is 
     *   likely a bug lurking.
     */
    function getSwitchMatch(fixture: Match[][], teamsCount: number): SwapMatch {
        // Getting intial random values
        let randRound: number = Math.floor(Math.random() * fixture.length);
        let randMatchNum: number = Math.floor(Math.random() * fixture[randRound].length);
        
        // If we have an reserved match, we iterate until we find a free one
        let unreserved: boolean;
        for( let i: number = 0; i < fixture.length; i++ ){ // Each round
            unreserved = false;
            for( let l: number = 0; l < fixture[randRound].length; l++ ){ // Each game in round
                if( fixture[randRound][randMatchNum].reserved ){
                    randMatchNum++;
                    if( randMatchNum >= fixture[randRound].length ){
                        randMatchNum = 0;
                    }
                } else {
                    unreserved = true;
                    break;
                }
            }

            // If there are no unreserved games to swap with this round, we have to try the next round
            if( unreserved ){
                break;
            }
        }
        
        if( !unreserved ){
            // If no valid match could be found to swap, abort.
            // This should not happen during plotFixtureRotation.
            throw new Error('Could not find a match in the fixture to alter.');
        }

        // Return a new SwapMatch containing a copy of the chosen match with home and away switched
        return new SwapMatch( new Match(randRound, fixture[randRound][randMatchNum].awayTeam, fixture[randRound][randMatchNum].homeTeam),
                              randMatchNum);
    }

    /**
     * calcAcceptProb
     * Calculates the probability that a new solution will be accepted by the 
     * simulated annealing algorithm based on the given parameters.
     */
    function calcAcceptProb( oldC: number, newC: number, temperature: number ): number {
        return Math.pow(Math.E,(oldC - newC)/temperature);
    }
    
    
    ///////////////// +++++++++ Sanity Checking +++++++++ /////////////////////
    
    // Checking for lack of teams
    if( teams.length < 2 ){
        throw new Error('At least two teams are required to make a fixture.');
    }

    // Checking for odd number of teams
    if( teams.length % 2 != 0 ){
        throw new Error('Odd number of teams in the teams parameter. Add a bye to make it even.');
    }

    // Checking if reserved matches are legal
    if( resvdMatches.length > 0 ){
        let twoDResvdMatches: Match[][] = convertOneDToTwoDFixture(numRounds, resvdMatches);
        table.applyFixture(twoDResvdMatches);
        let reservedCost = table.fixtureCost(twoDResvdMatches, teams);
        if( reservedCost > 0 ){
            throw new Error('Reserved Matches break a constraint.')
        } else if( resvdMatches.length == ((numTeams/2)*numRounds) ){
            // Fixture is already fully booked. Return sorted reserved matches.
            return convertTwoDToOneDFixture(convertOneDToTwoDFixture(numRounds, resvdMatches));
        }
    }

    
    ////////////// +++++++++ Simulated Annealling +++++++++ ///////////////////
    
    let temperature: number = 1; // The temperature. This lowers as we iterate, in turn lowering acceptProb
    let tempMin: number = MINIMUM_TEMPERATURE; // The temperature point at which the annealing stops
    let alphaCoolRate: number = ALPHA_COOLING_RATE; // The proportion of the temperature removed with every iteration
    let coolFrequency: number = INITIAL_COOLING_FREQUENCY; // How many random changes must be made before the temperature is multiplied by the cooling rate
    let acceptProb: number; // Probability of accepting a new solution

    // Fill a fixture randomly without constraints, adding reserved teams
    let crtFixture: Match[][] = randomFixture(numRounds, numTeams, resvdMatches);

    // Count up the weight of the broken constraints in the fixture
    table.applyFixture(crtFixture);
    let crtCost = table.fixtureCost(crtFixture, teams);
    let newCost: number;
    let swapOut: SwapMatch;

    let bestFixture: Match[][] = cloneFixture(crtFixture);
    let bestCost: number = crtCost;
    let solnFound: boolean = false;

    while( Date.now() - startTime < searchTimeout ){

        if( verbose ) {
            console.log('Beginning annealing. coolFrequency = ' + coolFrequency);
        }

        temperature = 1;
    
        while( temperature > tempMin ){
            for( let i: number = 0; i < coolFrequency; i++ ){
                if( verbose ){
                    permCounter++;
                }
                
                // Getting a match to swap with an existing one
                swapOut = getSwapMatch(crtFixture, numTeams);

                // Applying the swapped match to the table
                table.clearMatch( crtFixture[swapOut.match.roundNum][swapOut.swapIndex] );
                table.setMatch( swapOut.match );
                
                // Measuring the cost of the fixture if altered by the match swap
                newCost = table.alteredFixtureCost(crtFixture, swapOut.match, swapOut.swapIndex, teams);

                // Calculate the acceptance probability
                acceptProb = calcAcceptProb(crtCost, newCost, temperature);

                // Adopt the altered fixture if an rng rolls below the acceptProb
                if( Math.random() < acceptProb || newCost < crtCost ){
                    crtFixture[swapOut.match.roundNum][swapOut.swapIndex] = swapOut.match;
                    crtCost = newCost;

                    // Bring the crtFixture forth in the function if a completely legal solution is found
                    if( crtCost <= 0 ){
                        if( verbose ){
                            console.log('Solution found after ' + permCounter + ' permutations. Time elapsed = ' + (Date.now()-startTime));
                        }
                        
                        table.printCostsToConsole(crtFixture, teams);
                        return convertTwoDToOneDFixture(crtFixture);
                        /*solnFound = true;
                        break;*/
                    } else if( crtCost < bestCost ){
                        // Recording the best attempt thus far
                        bestFixture = cloneFixture(crtFixture);
                        bestCost = crtCost;

                        if( verbose ){
                            console.log("Temp = " + temperature + ", bestCost = " + bestCost + ", newCost = " + newCost + ", crtCost = " + crtCost + ", TeamsCount = " + numTeams + ", Acceptance Probability = " + acceptProb);
                        }
                    }
                } else {
                    // Reverse table edits so we can try again
                    table.clearMatch( swapOut.match );
                    table.setMatch( crtFixture[swapOut.match.roundNum][swapOut.swapIndex] );
                }
            }
            temperature *= alphaCoolRate;
        }

        // Resetting with more time between cooling and our best solution so far
        coolFrequency *= COOLFREQ_RETRY_FACTOR;
        crtFixture = bestFixture;
        crtCost = bestCost;
        table.applyFixture(crtFixture);
    }

    if( verbose ){
        table.printCostsToConsole(crtFixture, teams);
    }

    if( crtCost > 0 ){
        throw new Error("Solution could not be found in the time provided. Permutations = " + permCounter + ", time elapsed = " + (Date.now()-startTime));
    }
    
}
