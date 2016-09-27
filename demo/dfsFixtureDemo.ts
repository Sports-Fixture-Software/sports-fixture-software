import { Match, Team, MatchState, ConTable } from './FixtureConstraints';

/**
 * plotFixture
 * 
 * Plots a fixture with enough rounds for each team to play every other at most
 * once. Uses DFS through the solution space, pruning branches that break 
 * simple constraints.
 * 
 * Params:
 * teams: Team[] The teams playing in the season fixture. These must implement
 *               the Team interface. Does NOT include team of index -1. Must 
 *               have an even number of elements (even teams or odd teams + bye)
 * resvdMatches: Match[] The matches that are already locked in before 
 *                       generation begins. Order not needed.
 * globalCon: Team[] The constraints that apply to EVERY team if their Team
 *                   interface members are not specified.
 * 
 * Returns:
 * Match[] A complete and legal fixture. Ordering is not guaranteed. Sort by 
 *         round number for ease of plotting.
 * 
 * Throws Errors:
 * 'Odd number of teams...' if there is an odd number of teams.
 * 'Reserved Matches clash with basic constraints...' One or more of the 
 *   reserved matches breaks rotation, or tries to play one team twice in one 
 *   round, or tries to play a team against itself.
 */
function plotFixtureRotation( teams: Team[], resvdMatches: Match[], globalCon: Team ): Match[] {
    
    /**
     * fillFrom
     * Fills out the given ConTable by DFS and backtracking. Starts at the 
     * given round and fills out the entire rotation. Obeys the constraints of 
     * the teams supplied in the Team array. This _might_ take a while to run.
     * 
     * The prefilled match count is to help the function keep track of the 
     * number of games set so far. If there have been manual matchups before
     * calling fillFrom, the number of them must be supplied in crntMatchCount.
     * 
     * MUTATES THE CONTABLE. SAVE IT BEFORE CALLING IF YOU WANT TO TRY ANOTHER 
     * WAY.
     * 
     * Returns:
     * True if the ConTable was successfully filled.
     * False if the Contable could not be successfully filled with any solution.
     * 
     * Throws:
     * "Starting round is out of bounds..." startingRnd must be between 0 and 
     *    the number of teams -1.
     */
    function fillFrom( startingRnd: number, table: ConTable, teams: Team[], crntMatchCount: number ): Match[]{
        // Sanity checking starting round.
        var teamsCount: number = teams.length;
        var roundCount: number = teamsCount - 1;
        if( startingRnd > roundCount || startingRnd < 0 ){
            throw new Error("Starting round is out of bounds for this rotation.");
        }

        // Iterating over rounds while failing, recursing where succeeding.
        var currentMatch: Match;
        currentMatch.roundNum = startingRnd;
        currentMatch.homeTeam = Math.floor(Math.random() * (teamsCount));
        currentMatch.awayTeam = Math.floor(Math.random() * (teamsCount));
        var matchCount: number = crntMatchCount;
        var storedRoundState: number[][];
        var mask: number;
        for( var i: number = 0; i < roundCount; i++ ){

            // Home teams, iterating until we can recurse.
            for( var j: number = 0; j < teamsCount; j++ ){
                mask = table.getMask(currentMatch);

                switch( mask ){
                case MatchState.HOME_PLAYING_AWAY:
                case MatchState.HOME_PLAYING_HOME:
                    // Home team not available, go to the next one
                    break;
                default: // Home team available.

                    // Away teams, iterating until we can recurse.
                    for( var k: number = 0; k < teamsCount; k++ ){
                        mask = table.getMask(currentMatch);

                        switch( mask ){
                        case MatchState.ILLEGAL:
                        case MatchState.RESERVED:
                        case MatchState.MATCH_SET:
                        case MatchState.AWAY_PLAYING_AWAY:
                        case MatchState.AWAY_PLAYING_HOME:
                            // Away team not available, go to the next one
                            break;
                        default: // Away team and home team available: Match found
                            
                            // TODO: Committing and/or backtracking the match 

                            break;
                        }

                        // Go to next away team
                        currentMatch.awayTeam++;
                        if( currentMatch.awayTeam >= teamsCount ){
                            currentMatch.awayTeam = 0;
                        }
                    }
                    break;
                }

                // Go to the next home team
                currentMatch.homeTeam++;
                if( currentMatch.homeTeam >= teamsCount ){
                    currentMatch.homeTeam = 0;
                }
                
            }

        }
        // Round recursion. If complete, slice and fill from next round.
        
        // Randomly determine which away and home teams to start on.

        // Iterate through those teams until a free match is found
        // If complete, slice and recurse to next round?
    }
    
    // Checking for odd number of teams
    if( teams.length % 2 != 1 ){
        throw new Error('Odd number of teams in the teams parameter. Add a bye to make it even.');
    }

    // Creating and populating matrix that stores the matchup states.
    var matchupState: ConTable = new ConTable( teams.length );
    var successFlag: boolean = true;

    for( let match of resvdMatches ){
        successFlag = matchupState.setMatch(match, (MatchState.MATCH_SET & MatchState.RESERVED));
        if( !successFlag ){
            throw new Error('Reserved Matches clash with basic constraints in this rotation.');
        }
    }

    // Populate the rest of the ConTable, starting from a random round
    var startRound: number = Math.floor(Math.random() * (teams.length));
    var finalMatches: Match[] = this.fillFrom(startRound, matchupState, teams);
    
    // Return the match list in round order  
}
