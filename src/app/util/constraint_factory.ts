import { Match, FixtureInterface } from '../services/scheduler/dfs/fixture_constraints'; 

/**
 * Constraint Enumeration
 * Used for indicating which constraints are broken when checked by fixture 
 * generating software. More values must be added as constraints are 
 * implemented.
 * 
 * SATISFIED is for indicating that no constraints are broken.
 * 
 * TODO: WHEN ISSUE #109 IS PULLED, ITS VERSION OF THIS MUST BE DELETED.
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
     * Produces a function for checking maximum consecutive home and away games.
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
            
            // Checking prior games
            for( var i: number = 1; i < max; i++ ){
                count++;
                if( fixture.getAwayTeamVs( proposedMatch.roundNum-i, proposedMatch.homeTeam ) == -1 ){
                    count = 0;
                }
                if( count > max ){
                    return false;
                }
            }

            // Accounting for the proposed match
            count++;
            if( count > max ){
                return false;
            }

            // Checking future games. The count should carry over.
            for( var i: number = 1; i < max; i++ ){
                count++;
                if( fixture.getAwayTeamVs( proposedMatch.roundNum+i, proposedMatch.homeTeam ) == -1 ){
                    count = 0;
                }
                if( count > max ){
                    return false;
                }
            }
            
            // The count of consecutive matches never exceeded the maximum.
            // The proposed match is consistent.
            return true;
        }
    }

}
