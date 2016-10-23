import { Match, Team, MatchState, ConTable } from './fixture_constraints';
import { Constraint } from '../../../util/constraint_factory'

///////////////////////////// CONFIG VARIABLES ////////////////////////////////

/**
 * The inverse of the proportion of the search space to be covered in the
 * time given to plotFixture. Make this large enough or else each branch 
 * will run out of alloted time before it can reach any leaf nodes.
 * 
 * The time given to a single branch is equal to: 
 *   [Time budget of parent branch]
 * ----------------------------------   x  SEARCH_PRPORTN
 * [Number of siblings of the branch]
 */ 
const SEARCH_PRPORTN: number = 1000

// Milliseconds before the algorithm gives up.
const DEFAULT_SEARCH_TIMEOUT: number = 60000;

//////////////////////// THE FIXTURE ALGORITHM ////////////////////////////////

/**
 * plotFixture
 * 
 * Plots a fixture with enough rounds for each team to play every other at most
 * once. Uses DFS through the solution space, pruning branches that break 
 * simple constraints. The search is guided by the min-conflict and max-domain-
 * size heuristics. These make it more likely to either find the end of a dead-
 * end or find a valid solution fastest.
 * 
 * Params:
 * teams: Team[] The teams playing in the season fixture. These must implement
 *               the Team interface. Must have an even number of elements (even   
 *               teams or odd teams + bye)
 * resvdMatches: Match[] The matches that are already locked in before 
 *                       generation begins. Order not needed.
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
 * Match[] A complete and legal fixture. Ordering is not guaranteed. Sort by 
 *         round number for ease of plotting.
 * 
 * Throws Errors:
 * 'At least two teams are required to make a fixture.' 1 or 0 teams were in 
 *   teams parameter array.
 * 'Odd number of teams...' if there is an odd number of teams.
 * 'Reserved Matches clash with basic constraints...' One or more of the 
 *   reserved matches breaks rotation, or tries to play one team twice in one 
 *   round, or tries to play a team against itself.
 * 'Solution could not be found...' The function ran through the entire 
 *   solution space and could not find a solution. This is most likely because 
 *   constraints made a solution impossible without this function picking up on
 *   it.
 * fillfrom() errors
 * ConTable.x() errors 
 */
export function plotFixtureRotation( teams: Team[], resvdMatches: Match[], verbose: boolean = false, searchTimeout: number = DEFAULT_SEARCH_TIMEOUT ): Match[] {
    
    var permCounter: number = 1;
    var matchupState: ConTable;

    /**
     * cmpMinConfMaxDom
     * Comparison function for sorting matches by the min-confict and max-
     * domain-size heuristics.
     * 
     * THIS IS A LOCAL FUNCTION AS IT REQUIRES THE matchupState VARIABLE TO 
     * GATHER HEURISTIC DATA ABOUT THE COMPARED MATCHES.
     *  
     * Params:
     * m1, first match
     * m2, second match
     * 
     * Returns:
     * <0 if m2 comes before m1
     * >0 if m1 comes before m2
     * 0 if equal
     */
    var cmpMinConfMaxDom = function(m1: Match, m2: Match): number {
        if( m1.footPrnt == m2.footPrnt ){
             // If the minimum matchup conflict is equal, sort by maximum domain size
            return matchupState.domainOfRound[m2.roundNum] - matchupState.domainOfRound[m1.roundNum];
        } else {
            // Else, sort by minimum matchup conflict 
            return m1.footPrnt - m2.footPrnt;
        }
    }

    /**
     * fillFrom
     * Fills out the given ConTable by DFS and backtracking. Finds a match and
     * recurses until the entire rotation is filled. Obeys the constraints of 
     * the teams supplied in the Team array. This _might_ take a while to run.
     * 
     * Due to the timeout feature of this search, it is not guaranteed to find 
     * a solution, but it is very likely to. If no solution is found, there are
     * either so few solutions that one could not be found in the given time, 
     * or there is was no possible solution to begin with. Knowing this in 
     * advance is an NP-complete problem :(.
     * 
     * This also mutates a bunch of its paramers, so pay attention:
     * 
     * Params:
     * table is the ConTable to be filled. It must have the reserved matches 
     *   already added to it with its setMatch method. The mutation of filling 
     *   the ConTable will remain after the function finishes.
     * teams is an array of Teams that will be referred to for constraint 
     *   checking.
     * matches is the array that will be appended with the Matches chosen by 
     *   the function. Populate this with reserved matches beforehand and 
     *   sort by round later to have an easier time collating everything. This 
     *   function will not alter existing contents of this array.
     * crntMatchCount is to help the function keep track of the number of 
     *   games set so far. If there have been manual matchups in the table
     *   parameter before calling fillFrom, the number of them MUST be  
     *   supplied in crntMatchCount.
     * mQueue is a queue of legal matchup considerations ordered via heuristics 
     *   calculated by a Look-Ahead technique. Matches are always considered in
     *   order of this queue on its respective recursion level.
     * timeBudget maximum time in milliseconds that the fillFrom call can run 
     *   in total. It spreads this time over a proportion of its search 
     *   branches as specified in pfrConfig.SEARCH_PRPORTN.
     * 
     * Returns:
     * True if the ConTable was successfully filled.
     * False if the Contable could not be successfully filled with any solution.
     * 
     * Throws:
     * "Max search depth exceeded." The function is recursing more than it has 
     *    matches to assign. This should not be thrown unless there is a bug in
     *    this function.
     * ConTable.x() errors
     */
    function fillFrom( table: ConTable, teams: Team[], matches: Match[], crntMatchCount: number, mQueue: Match[], timeBudget: number ): boolean {
        var teamsCount: number = teams.length;
        var roundCount: number = teamsCount - 1;
        var matchCount: number = (roundCount*(teamsCount/2));
        var timeStart: number = Date.now();

        // Checking if we are recursing past our limit. This should not happen.
        if( crntMatchCount > matchCount ){
            throw new Error("Max search depth exceeded.");
        }
        
        var equalStack: Match[] = [];
        var eqMatchIndex: number;
        var matchFound: boolean = false;
        var currentMatch: Match;
        var awayCnsnt: Constraint;
        var homeCnsnt: Constraint;
        
        // Trying each matchups in the mQueue
        for( var i: number = 0; i < mQueue.length; i++ ){
            
            // Checking against our time budget
            if( Date.now() - timeStart > timeBudget ){
                if( verbose ) {
                    console.log("### TIMEOUT on level " + crntMatchCount + "/" + matchCount + " Date.now() = " + Date.now() + ", timeBudget = " + timeBudget);
                }
                return false;
            }
            
            // Matches are selected in random order if equal
            // The random order is set up below where required
            if( equalStack.length <= 0 ){
                // Gathering all matches of equal best heuristic
                eqMatchIndex = i;
                equalStack = [];
                while( eqMatchIndex < mQueue.length && cmpMinConfMaxDom(mQueue[i], mQueue[eqMatchIndex]) === 0 ){
                    equalStack.push(mQueue[eqMatchIndex]);
                    eqMatchIndex++;
                }

                // Scramble the order of equal matches
                equalStack.sort(function(a: Match, b: Match): number {
                    if( Math.random() > 0.5 ){
                        return 1;
                    } else {
                        return -1;
                    }
                });
            }

            // Getting next random match of equal heuristic priority
            currentMatch = equalStack.pop();
            
            // Checking constraints on the away team
            awayCnsnt = teams[currentMatch.awayTeam].constraintsSatisfied(table,currentMatch,false);
            if( awayCnsnt !== Constraint.SATISFIED ){

                if( verbose ){
                    console.log("**** Away constraint unsatisfied, removing offenders from queue: R" + currentMatch.roundNum + " A" + currentMatch.awayTeam);
                }

                // Learn from broken constraint
                switch( awayCnsnt ){

                    // This match would leave its away team playing too many away games in a row
                    case Constraint.MAX_CONSEC_AWAY:
                        let isCurrentAwayMatchInRound = function (m: Match, index: number): boolean {
                            // The loop iterator must be set back according to the number of matches removed
                            if( index < i ){
                                i--;
                            }
                            return !(m.roundNum == currentMatch.roundNum &&
                                     m.awayTeam == currentMatch.awayTeam);
                        }

                        // Remove all away games for this team in this round from the queue
                        mQueue = mQueue.filter(isCurrentAwayMatchInRound);
                        equalStack = equalStack.filter(isCurrentAwayMatchInRound);
                        break;

                    // This match would leave its away team playing too many away games in this fixture
                    case Constraint.MAX_AWAY:
                        console.log("MAX_AWAY constraint not yet implemented in plotFixtureRotation.");
                    default:
                }
            }

            // Checking constraints on the home team
            homeCnsnt = teams[currentMatch.homeTeam].constraintsSatisfied(table,currentMatch,true);
            if( homeCnsnt !== Constraint.SATISFIED ){
                
                if( verbose ){
                    console.log("**** Home constraint unsatisfied, removing offenders from queue: R" + currentMatch.roundNum + " H" + currentMatch.homeTeam);
                }

                // Learn from broken constraint
                switch( homeCnsnt ){

                    // This match would leave its home team playing too many home games in a row
                    case Constraint.MAX_CONSEC_HOME:
                        let isCurrentHomeMatchInRound = function (m: Match, index: number): boolean {
                            // The loop iterator must be set back according to the number of matches removed
                            if( index < i ){
                                i--;
                            }
                            return !(m.roundNum == currentMatch.roundNum &&
                                    m.homeTeam == currentMatch.homeTeam);
                        }

                        // Remove all home games for this team in this round from the queue
                        mQueue = mQueue.filter(isCurrentHomeMatchInRound);
                        equalStack = equalStack.filter(isCurrentHomeMatchInRound);
                        break;

                    // This match would leave its home team playing too many home games in this fixture  
                    case Constraint.MAX_HOME:
                        console.log("MAX_HOME constraint not yet implemented in plotFixtureRotation.");
                    default:
                }
            }

            // Our match will work now if all team constraints are satisfied. 
            if( homeCnsnt === Constraint.SATISFIED && awayCnsnt === Constraint.SATISFIED ){
                
                // Reporting progress to console
                if( verbose && crntMatchCount <= 153 ){
                    //var domainOfFixture: number = 0;
                    //for( var s: number = 0; s < roundCount; s++ ){
                    //    domainOfFixture += table.domainOfRound[s];
                    //}
                    //console.log("Round domain sum before = " + domainOfFixture + ", Match ftprnt = " + currentMatch.footPrnt + ", Matches Left To Be Set = " + (matchCount - crntMatchCount) );
                    //var domLeeway: number = domainOfFixture - currentMatch.footPrnt - 2*(matchCount - crntMatchCount - 1); // Domain after minimum footprint is taken
                    console.log("- Level " + crntMatchCount + "/" + matchCount + ". timeBudget = " + timeBudget + " i=" + i + "/" + mQueue.length + ". Setting match R" + currentMatch.roundNum + ", H" + currentMatch.homeTeam + ", A" + currentMatch.awayTeam);
                }

                // Set the match up
                table.setMatch(currentMatch);
                
                /* Making a new mQueue for the next level of the search tree.
                   No new matches are made available by adding a match, so we 
                   can reuse the matches from the mQueue given to us, if they 
                   are still legal and usable. Usable matches must not have a
                   bigger footprint than the number of matches remaining that
                   must set. The footprint is augmented by the minimum expected
                   footprint of remaining matches.
                 */
                var nextMQueue: Match[] = new Array();
                var domainOfFixture: number = 0; // Sum of domain of all rounds in the ConTable
                var matchesRemaining: number = matchCount - crntMatchCount - 1; // The -1 is for the match set in table.setMatch above
                var currentFtPt: number;
                var minRemainingFtpt: number = (2*(matchesRemaining-1)); // Minimum footprint of all remaining matches sans the one added to the queue
                
                for( var j: number = 0; j < roundCount; j++ ){
                    domainOfFixture += table.domainOfRound[j];
                }
                
                for( var j: number = 0; j < mQueue.length; j++ ){
                    currentFtPt = table.calcFootPrint( mQueue[j] );
                    if( table.getMask( mQueue[j] ) === MatchState.OPEN &&
                        currentFtPt + minRemainingFtpt <= domainOfFixture ){
                        // Legal matches are duplicated and updated for the next recursion level
                        nextMQueue.push( new Match(
                            mQueue[j].roundNum, 
                            mQueue[j].homeTeam, 
                            mQueue[j].awayTeam, 
                            currentFtPt
                        ));
                    }
                }

                // Sorting the new mQueue by the min-conflicts max-domain-size heuristics
                nextMQueue.sort(cmpMinConfMaxDom);

                if( verbose ) {
                    permCounter++;
                }

                // Set the time budget for the next branch.
                let branchTime: number;
                if( mQueue.length < SEARCH_PRPORTN ){
                    branchTime = timeBudget / mQueue.length;
                } else {
                    branchTime = timeBudget /(mQueue.length / SEARCH_PRPORTN); 
                }

                // Recurse to set the rest of the table. True if filled, false if no solution.
                matchFound = fillFrom( table, teams, matches, crntMatchCount+1, nextMQueue, branchTime );
                
                // If match found add to final match set. Else this is not the solution, backtrack and keep looking.
                if( matchFound ){
                    matches.push(currentMatch);
                    break;
                } else {
                    table.clearMatch(currentMatch);
                }
            }
        }

        // Checking if the conTable is fully filled. (Only true at bottom of recursion tree.)
        if( crntMatchCount === matchCount ){
            // If so, we can go up the recursion stack with success
            matchFound = true;
        }

        return matchFound;
    }


    ///////////////////////////////////////////////////////////////////////////
    /////////////////// +++++++++ SETUP CODE +++++++++ ////////////////////////
    ///////////////////////////////////////////////////////////////////////////

    // Checking for lack of teams
    if( teams.length < 2 ){
        throw new Error('At least two teams are required to make a fixture.');
    }

    // Checking for odd number of teams
    if( teams.length % 2 != 0 ){
        throw new Error('Odd number of teams in the teams parameter. Add a bye to make it even.');
    }

    // Creating and populating matrix that stores the matchup states.
    matchupState = new ConTable( teams.length );
    var successFlag: boolean = true;

    for( var i: number = 0; i < resvdMatches.length; i++ ){
        successFlag = matchupState.setMatch(resvdMatches[i], (MatchState.MATCH_SET | MatchState.RESERVED));
        if( !successFlag ){
            throw new Error('Reserved Matches clash with basic constraints in this rotation.');
        }
    }

    // Initialising Look-ahead queue. Uses a min-conflicts -> max-domain-size heuristic
    var lookMatch: Match = new Match(0,0,0);
    var matchMask: number = matchupState.getMask(lookMatch);
    var matchQueue: Match[] = new Array();
    
    // Checking available matchups for the number of conflicts they would cause (min-conflicts heuristic)
    // Rounds
    for( var i: number = 0; i < teams.length-1; i++ ){
        if( matchupState.domainOfRound[i] > 0 ){
            lookMatch.roundNum = i;
            
            // Home Teams
            for( var j: number = 0; j < teams.length; j++ ){
                lookMatch.homeTeam = j;
                matchMask = matchupState.getMask(lookMatch);
                if( (matchMask & MatchState.HOME_PLAYING_AWAY) === 0 &&
                    (matchMask & MatchState.HOME_PLAYING_HOME) === 0 ){
                    
                    // Away Teams
                    for( var k: number = 0; k < teams.length; k++ ){
                        lookMatch.awayTeam = k;
                        matchMask = matchupState.getMask(lookMatch);
                        if( j !== k && matchMask === MatchState.OPEN ){
                            // This match is in the domain of the current round.
                            
                            // Calculating the number of conflicts that the match will cause
                            lookMatch.footPrnt = matchupState.calcFootPrint( lookMatch );

                            // Adding to match queue
                            matchQueue.push( new Match(i,j,k,lookMatch.footPrnt) );

                        }
                    }
                }
            }
        }
    }
    
    // Sorting the matchup queue by minimum variable domain, and then minimum value footprint
    matchQueue.sort(cmpMinConfMaxDom);

    // Populate the rest of the ConTable with fillFrom, starting from a random round
    var finalMatches: Match[] = resvdMatches.slice();
    if( fillFrom(matchupState, teams, finalMatches, resvdMatches.length, matchQueue, searchTimeout ) ){
        if( verbose ){
            console.log("Solution found after " + permCounter + " permutations.")
        }
        
        // Sorting finalMatches by round and returning
        finalMatches.sort(function(a: Match, b: Match): number {return a.roundNum-b.roundNum});
        return finalMatches;
    }

    if( verbose ){
        console.log("No solution found after " + permCounter + " permutations.")
    }

    throw new Error("Solution could not be found in the search space.");
}
