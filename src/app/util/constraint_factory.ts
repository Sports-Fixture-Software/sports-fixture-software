import { Match, FixtureInterface, RotationInfo } from '../services/scheduler/dfs/fixture_constraints';

/**
 * Constraint Enumeration
 * Used for indicating which constraints are broken when checked by fixture 
 * generating software. More values must be added as constraints are 
 * implemented.
 * 
 * SATISFIED is for indicating that no constraints are broken.
 */
export enum Constraint {
    SATISFIED = 0,
    MAX_HOME = 1,
    MIN_HOME = 2,
    MAX_AWAY = 3,
    MIN_AWAY = 4,
    MAX_CONSEC_HOME = 5,
    MAX_CONSEC_AWAY = 6
}

/** 
 * ConstrCheck
 * The interface that all constraint functions must conform to.
 * This interface is really just here to save space when dealing with them. 
 */
export interface ConstrCheck {
    ( fixture: FixtureInterface, proposedMatch: Match ): boolean; 
}

/**
 * ConstraintFactory
 * Produces constraint checking functions for teams, fixtures, and leagues 
 * according to given parameters. A new producing function is implemented for 
 * each new constraint.
 * 
 * Each producing function must return a function that takes a Fixture 
 * implementation and a proposed Match as parameters and returns a boolean; 
 * true for the match being consistent with the constraint, false otherwise. 
 */
export class ConstraintFactory {

    /** createMaxConsecHome 
     * Produces a function for checking maximum consecutive home games.
     * Param 'maximum' must be greater than 1. This is not an off-by-one error.
     * 
     * It is assumed that this constraint will only be checked if the subject 
     * team is the home team in the proposedMatch.
     */
    createMaxConsecHome( max: number ): ConstrCheck {
        if( max <= 1 ){
            throw new Error("Maximum consecutive home games must be greater than one to allow for full team rotation.");
        }

        return function ( fixture: FixtureInterface, proposedMatch: Match ): boolean {
            var count: number = 0;
            var locked: boolean = false;
            
            // Checking prior games
            for( var i: number = 0; i < max; i++ ){
                count++;
                if( fixture.getAwayTeamVs( proposedMatch.roundNum-(max-i), proposedMatch.homeTeam ) == -1 ){
                    count = 0;
                }
            }

            // Accounting for the proposed match
            count++;
            if( count > max ){
                return false;
            } else if ( count == max ){
                // Checking if this match prevents the home team from playing both home or away in the following rounds.
                locked = true;
                for( var i: number = 0; i < max; i++ ){
                    if( fixture.getHomeTeamVs( proposedMatch.roundNum+2+i, proposedMatch.homeTeam ) == -1 ){
                        locked = false;
                        break;
                    } 
                }
                if( locked ){
                    return false;
                }
            }

            // Checking future games. The count should carry over.
            for( var i: number = 0; i < max; i++ ){
                count++;
                if( fixture.getAwayTeamVs( proposedMatch.roundNum+1+i, proposedMatch.homeTeam ) == -1 ){
                    count = 0;
                }
                if( count > max ){
                    return false;
                } else if ( count == max ){
                    // Checking if this match prevents the home team from playing both home or away in the previous rounds.
                    locked = true;
                    for( var j: number = 0; j < max; j++ ){
                        if( fixture.getHomeTeamVs( proposedMatch.roundNum-2-j, proposedMatch.homeTeam ) == -1 ){
                            locked = false;
                            break;
                        } 
                    }
                    if( locked ){
                        return false;
                    }
                }
            }
            
            // The count of consecutive matches never exceeded the maximum.
            // The proposed match is consistent.
            return true;
        }
    }


    /** createMaxConsecAway 
     * As createMaxConsecHome, but for away games.
     * 
     * It is assumed that this constraint will only be checked if the subject 
     * team is the away team in the proposedMatch.
     */
    createMaxConsecAway( max: number ): ConstrCheck {
        if( max <= 1 ){
            throw new Error("Maximum consecutive away games must be greater than one to allow for full team rotation.");
        }

        return function ( fixture: FixtureInterface, proposedMatch: Match ): boolean {
            var count: number = 0;
            var locked: boolean = false;
            
            // Checking prior games
            for( var i: number = 0; i < max; i++ ){
                count++;
                if( fixture.getHomeTeamVs( proposedMatch.roundNum-(max-i), proposedMatch.awayTeam ) == -1 ){
                    count = 0;
                }
            }

            // Accounting for the proposed match
            count++;
            if( count > max ){
                return false;
            } else if ( count == max ){
                // Checking if this match prevents the home team from playing both home or away in the following rounds.
                locked = true;
                for( var i: number = 0; i < max; i++ ){
                    if( fixture.getAwayTeamVs( proposedMatch.roundNum+2+i, proposedMatch.awayTeam ) == -1 ){
                        locked = false;
                        break;
                    } 
                }
                if( locked ){
                    return false;
                }
            }

            // Checking future games. The count should carry over.
            for( var i: number = 0; i < max; i++ ){
                count++;
                if( fixture.getHomeTeamVs( proposedMatch.roundNum+1+i, proposedMatch.awayTeam ) == -1 ){
                    count = 0;
                }
                if( count > max ){
                    return false;
                } else if ( count == max ){
                    // Checking if this match prevents the home team from playing both home or away in the previous rounds.
                    locked = true;
                    for( var j: number = 0; j < max; j++ ){
                        if( fixture.getAwayTeamVs( proposedMatch.roundNum-2-j, proposedMatch.awayTeam ) == -1 ){
                            locked = false;
                            break;
                        } 
                    }
                    if( locked ){
                        return false;
                    }
                }
            }
            
            // The count of consecutive matches never exceeded the maximum.
            // The proposed match is consistent.
            return true;
        }
    }

    /**
     * Checks the fixture (current rotation only) to see if the
     * `proposedMatch` exceeds the specified max number of home games for the
     * specified team `teamid`.
     * Returns true if `proposedMatch` would exceed the max home games.
     * False otherwise.
     */
    createMaxHome(teamid: number, homeGamesMax: number): ConstrCheck {
        return function (fixture: FixtureInterface, proposedMatch: Match): boolean {
            // only calculate constraint if the proposed match is adding a home
            // game
            if (proposedMatch.homeTeam != teamid) {
                return true
            }

            let rot = fixture.getRotation(proposedMatch.roundNum)
            if (rot == undefined) {
                throw new Error(`Unable to locate round ${proposedMatch.roundNum} in rotations`)
            }
            let count = 0
            for (let round = rot.startRound; round <= rot.endRound; round++) {
                if (fixture.getAwayTeamVs(round, teamid) >= 0) {
                    count++
                    if (count >= homeGamesMax) {
                        return false
                    }
                }
            }
            return true
        }
    }

    /**
     * Checks the fixture (current rotation only) to see if the
     * `proposedMatch` exceeds the specified max number of away games for the
     * specified team `teamid`.
     * Returns true if `proposedMatch` would exceed the max away games.
     * False otherwise.
     */
    createMaxAway(teamid: number, awayGamesMax: number): ConstrCheck {
        return function (fixture: FixtureInterface, proposedMatch: Match): boolean {
            // only calculate constraint if the proposed match is adding a away
            // game
            if (proposedMatch.awayTeam != teamid) {
                return true
            }

            let rot = fixture.getRotation(proposedMatch.roundNum)
            if (rot == undefined) {
                throw new Error(`Unable to locate round ${proposedMatch.roundNum} in rotations`)
            }
            let count = 0
            for (let round = rot.startRound; round <= rot.endRound; round++) {
                if (fixture.getHomeTeamVs(round, teamid) >= 0) {
                    count++
                    if (count >= awayGamesMax) {
                        return false
                    }
                }
            }
            return true
        }
    }

}
