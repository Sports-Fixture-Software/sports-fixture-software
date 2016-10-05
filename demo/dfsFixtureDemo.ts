import { Match, Constraint, Team, MatchState, ConTable } from './FixtureConstraints';

/**
 * plotFixture
 * 
 * Plots a fixture with enough rounds for each team to play every other at most
 * once. Uses DFS through the solution space, pruning branches that break 
 * simple constraints.
 * 
 * Params:
 * teams: Team[] The teams playing in the season fixture. These must implement
 *               the Team interface. Must have an even number of elements (even   
 *               teams or odd teams + bye)
 * resvdMatches: Match[] The matches that are already locked in before 
 *                       generation begins. Order not needed.
 * verbose: boolean Set to true if you want the function to post progress to 
 *                  the console.
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
export function plotFixtureRotation( teams: Team[], resvdMatches: Match[], verbose: boolean = false ): Match[] {
    
    var permCounter: number = 1;

    /**
     * fillFrom
     * Fills out the given ConTable by DFS and backtracking. Finds a match and
     * recurses until the entire rotation is filled. Obeys the constraints of 
     * the teams supplied in the Team array. This _might_ take a while to run.
     * 
     * This also mutates a bunch of its paramers, so pay attention:
     * 
     * Params:
     * startingRnd is the first round that the function should look for open 
     *   matches. The function will keep going through rounds until it finds an 
     *   open match, but this can be changed for a different starting point. 
     *   Starting closer to clusters of reserved matches may increase speed 
     *   slightly.
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
     * 
     * Returns:
     * True if the ConTable was successfully filled.
     * False if the Contable could not be successfully filled with any solution.
     * 
     * Throws:
     * "Starting round is out of bounds..." startingRnd must be between 0 and 
     *    the number of teams -1.
     * "Max search depth exceeded." The function is recursing more than it has 
     *    matches to assign. This should not be thrown unless there is a bug in
     *    this function.
     * ConTable.x() errors
     */
    function fillFrom( startingRnd: number, table: ConTable, teams: Team[], matches: Match[], crntMatchCount: number ): boolean {
        // Sanity checking starting round.
        var teamsCount: number = teams.length;
        var roundCount: number = teamsCount - 1;
        if( startingRnd > roundCount || startingRnd < 0 ){
            throw new Error("Starting round is out of bounds for this rotation.");
        }
        
        // Checking if we are recursing past our limit. This should not happen.
        if( crntMatchCount > roundCount * (teamsCount/2) ){
            throw new Error("Max search depth exceeded.");
        }
        
        // We start by trying a random home and away team
        var currentMatch: Match = new Match( 
            startingRnd,
            Math.floor(Math.random() * (teamsCount)),
            Math.floor(Math.random() * (teamsCount))
        );
        var mask: number = table.getMask(currentMatch);
        var matchFound: boolean = false;

        // Iterating over rounds while failing, recursing where succeeding.
        for( var i: number = 0; i < roundCount; i++ ){
            
            // Home teams, iterating until we can recurse.
            for( var j: number = 0; j < teamsCount; j++ ){
                
                // Checking if the home team is available.
                if( (mask & MatchState.HOME_PLAYING_AWAY) === 0 &&
                    (mask & MatchState.HOME_PLAYING_HOME) === 0 ){
                    
                    // Away teams, iterating until we can recurse.
                    for( var k: number = 0; k < teamsCount; k++ ){
                        
                        // Checking if the away team is available.
                        if( mask === MatchState.OPEN ){
                            // Away team and home team available: Match found.
                            
                            // Checking constraints
                            var awayCnsnt: Constraint = teams[currentMatch.awayTeam].constraintsSatisfied(table,currentMatch,false);
                            if( awayCnsnt !== Constraint.SATISFIED ){
                                // Learn from broken constraint (WHEN IMPLEMENTED)
                            }

                            var homeCnsnt: Constraint = teams[currentMatch.homeTeam].constraintsSatisfied(table,currentMatch,true);
                            if( homeCnsnt !== Constraint.SATISFIED ){
                                // Learn from broken constraint (WHEN IMPLEMENTED)
                            }

                            // Our match will work now if all team constraints are satisfied. 
                            if( homeCnsnt === Constraint.SATISFIED && awayCnsnt === Constraint.SATISFIED ){
                                // Set the match up
                                table.setMatch(currentMatch);
                                
                                if( verbose && crntMatchCount <= 6 ){
                                    console.log("Search Level " + crntMatchCount + " out of " + (roundCount * (teamsCount/2)) + " (Showing further levels slows the program down)");
                                    console.log("Set match " + currentMatch.roundNum + ", H" + currentMatch.homeTeam + ", A" + currentMatch.awayTeam);
                                }

                                // Recurse to set the rest of the table. True if filled, false if no solution. 
                                if( verbose ) {
                                    permCounter++;
                                }
                                
                                matchFound = fillFrom( currentMatch.roundNum, table, teams, matches, crntMatchCount+1 );
                                
                                // If this is not the solution, backtrack and keep looking. Else add to final match set.
                                if( !matchFound ){
                                    table.clearMatch(currentMatch);
                                } else {
                                    matches.push(currentMatch);
                                }
                            }
                        }

                        if( matchFound ){
                            break;
                        } else {
                            // Go to next *away team*
                            currentMatch.awayTeam++;
                            if( currentMatch.awayTeam >= teamsCount ){
                                currentMatch.awayTeam = 0;
                            }
                            mask = table.getMask(currentMatch);
                        }

                    }
                }

                if( matchFound ){
                    break;
                } else {
                    // Go to the next *home team*
                    currentMatch.homeTeam++;
                    if( currentMatch.homeTeam >= teamsCount ){
                        currentMatch.homeTeam = 0;
                    }
                    mask = table.getMask(currentMatch);
                }
            }

            if( matchFound ){
                break;
            } else {
                // Go to the next *round*
                currentMatch.roundNum++;
                if( currentMatch.roundNum >= roundCount ){
                    currentMatch.roundNum = 0;
                }
                mask = table.getMask(currentMatch);
            }
        }

        // Checking if the conTable is fully filled. (Only true at bottom of recursion tree.)
        if( crntMatchCount === (roundCount*(teamsCount/2)) ){
            // If so, we can go up the recursion stack with success 
            matchFound = true;
        }

        return matchFound;
    }
    
    // Checking for lack of teams
    if( teams.length < 2 ){
        throw new Error('At least two teams are required to make a fixture.');
    }

    // Checking for odd number of teams
    if( teams.length % 2 != 0 ){
        throw new Error('Odd number of teams in the teams parameter. Add a bye to make it even.');
    }

    // Creating and populating matrix that stores the matchup states.
    var matchupState: ConTable = new ConTable( teams.length );
    var successFlag: boolean = true;

    for( var i: number = 0; i < resvdMatches.length; i++ ){
        successFlag = matchupState.setMatch(resvdMatches[i], (MatchState.MATCH_SET | MatchState.RESERVED));
        if( !successFlag ){
            throw new Error('Reserved Matches clash with basic constraints in this rotation.');
        }
    }

    // Populate the rest of the ConTable with fillFrom, starting from a random round
    var startRound: number = Math.floor(Math.random() * (teams.length-1));
    var finalMatches: Match[] = resvdMatches.slice();
    if( fillFrom(startRound, matchupState, teams, finalMatches, resvdMatches.length ) ){
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