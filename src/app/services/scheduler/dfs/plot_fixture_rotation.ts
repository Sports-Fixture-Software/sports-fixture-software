import { Match, Team, MatchState, ConTable } from './fixture_constraints';
import { Constraint } from '../../../util/constraint_factory'

/**
 * plotFixtureRotation
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
    var matchupState: ConTable;

    /**
     * cmpMinConfMaxDom
     * Comparison function for sorting matches by the min-confict and max-
     * domain-size heuristics. Equal values are randomly placed to put 
     * more variation in when generating identically configured fixtures.
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
     * (Should not return 0 as equal matches are to be randomly sorted)
     */
    var cmpMinConfMaxDom = function(m1: Match, m2: Match): number {
        // Get the domain size of the round
        var m1Heur: number = matchupState.domainOfRound[m1.roundNum];
        var m2Heur: number = matchupState.domainOfRound[m2.roundNum];

        if( m1Heur === m2Heur ){
             // If the domain is equal, sort by minimum matchup conflict
            if( m1.footPrnt === m2.footPrnt ){
                // If both heuristics are equal, randomly give negative or positive
                if( Math.random() < 0.5 ){
                    return 0.5;
                } else {
                    return -0.5;
                }
            } else {
                // Else, sort by minimum conflicts caused by the match
                return m1.footPrnt - m2.footPrnt;
            }
        } else {
            // Else, sort by maximum domain size 
            return m1Heur - m2Heur;
        }
    }

    /**
     * fillFrom
     * Fills out the given ConTable by DFS and backtracking. Finds a match and
     * recurses until the entire rotation is filled. Obeys the constraints of 
     * the teams supplied in the Team array. This _might_ take a while to run.
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
    function fillFrom( table: ConTable, teams: Team[], matches: Match[], crntMatchCount: number, mQueue: Match[] ): boolean {
        var teamsCount: number = teams.length;
        var roundCount: number = teamsCount - 1;
        
        // Checking if we are recursing past our limit. This should not happen.
        if( crntMatchCount > roundCount * (teamsCount/2) ){
            throw new Error("Max search depth exceeded.");
        }
        
        var matchFound: boolean = false;
        var currentMatch: Match;
        var awayCnsnt: Constraint;
        var homeCnsnt: Constraint;

        // Trying each matchup in the mQueue
        for( var i: number = 0; i < mQueue.length; i++ ){
            currentMatch = mQueue[i];

            // Checking constraints
            awayCnsnt = teams[currentMatch.awayTeam].constraintsSatisfied(table,currentMatch,false);
            if( awayCnsnt !== Constraint.SATISFIED ){
                // Learn from broken constraint (WHEN IMPLEMENTED)
            }

            homeCnsnt = teams[currentMatch.homeTeam].constraintsSatisfied(table,currentMatch,true);
            if( homeCnsnt !== Constraint.SATISFIED ){
                // Learn from broken constraint (WHEN IMPLEMENTED)
            }

            // Our match will work now if all team constraints are satisfied. 
            if( homeCnsnt === Constraint.SATISFIED && awayCnsnt === Constraint.SATISFIED ){
                
                // Set the match up
                table.setMatch(currentMatch);
                
                /* Making a new mQueue for the next level of the search tree.
                   No new matches are made available by adding a match, so we 
                   can reuse the matches from the mQueue given to us, if they 
                   are still legal.
                 */
                var nextMQueue: Match[] = new Array();
                for( var j: number = 0; j < mQueue.length; j++ ){
                    if( table.getMask( mQueue[j] ) === MatchState.OPEN ){
                        // Legal matches are duplicated and updated for the next recursion level
                        nextMQueue.push( new Match(
                            mQueue[j].roundNum, 
                            mQueue[j].homeTeam, 
                            mQueue[j].awayTeam, 
                            table.calcFootPrint( mQueue[j] )
                        ));
                    }
                }

                // Sorting the new mQueue by the min-conflicts max-domain-size heuristics
                nextMQueue.sort(cmpMinConfMaxDom);

                // Reporting progress to console
                if( verbose && crntMatchCount <= 7 ){
                    console.log("Search Level " + crntMatchCount + " out of " + (roundCount * (teamsCount/2)) + " (Showing further levels slows the program down)");
                    console.log("Set match R" + currentMatch.roundNum + ", H" + currentMatch.homeTeam + ", A" + currentMatch.awayTeam);
                }

                if( verbose ) {
                    permCounter++;
                }

                // Recurse to set the rest of the table. True if filled, false if no solution.
                matchFound = fillFrom( table, teams, matches, crntMatchCount+1, nextMQueue );
                
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
        if( crntMatchCount === (roundCount*(teamsCount/2)) ){
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

    // Populate the rest of the ConTable with fillFrom, starting the head of matchQueue
    var finalMatches: Match[] = resvdMatches.slice();
    if( fillFrom(matchupState, teams, finalMatches, resvdMatches.length, matchQueue ) ){
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
