import { Constraint, FixtureInterface } from '../../../util/constraint_factory';
import { Match } from '../../../util/scheduler/match'

/**
 * Team
 * Interface to represent a team in a fixture to allow the fixture to check
 * against the team's constraints.
 */
export interface Team {
    /** 
     * constraintsSatisfied 
     * Returns the constraint that is broken by placing the proposedMatch into 
     * the fixture. Returns the value Constraint.SATISFIED if none are broken.
     * 
     * params:
     * fixture - The fixture in a state before the proposedMatch is applied
     * proposedMatch - The match that is being checked for constraints in the 
     *   given fixture
     * home - true if the team being tested is the home team in proposedMatch, 
     *   false if it is the away team in proposedMatch. 
     */   
    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match, home: boolean ): Constraint;

    /**
     * Getter functions for constraint parameters. Used for CostsTable to help 
     * calculate constraint costs.
     * 
     * These must return -1 if not in use.
     */
    consecutiveHomeGamesMax(): number;
    consecutiveAwayGamesMax(): number;
    homeGamesMax(): number;
    awayGamesMax(): number;
}

/**
 * Costs - Constraint costs
 * Values to add to matches that will break the listed constraints.
 */
enum Costs {
    TEAM_ROTN = 1,   // Team rotation constraint
    ONE_MPTPR = 1,   // One match per team per round
    MAX_CONSEC = 3,  // Maximum consecutive home/away games
    MAX_H_OR_A = 3,  // Maximum home/away games across the entire fixture
    ILLEGAL = 999999 // Illegal match
}

/** Constraint table. Keeps count of match constraint costs with a 3D matrix of
 *  numbers.
 * 
 *  Set all the matches of your fixtures in this with setMatch and then run 
 *  through their subsequent costs with getMatchCost. 
 */
export class CostsTable {
    
    // Used to keep track of setting a match in the given slot
    private matchCostCounts: number[][][]; //[round][Home Team Index][Away Team Index]

    // Used to keep track of the number of times a team in a round is set a match that qualifies it for the states below 
    private teamStates: number[][][]; // [round][team index][counter]
    
    // Indices for the [counter] layer of the teamStates matrix
    private static PLAYING_HOME: number = 0;
    private static PLAYING_AWAY: number = 1;
    private static MATCH_SET: number = 2;

    // Number of indices listed above
    private static teamCounterCount: number = 3;

    constructor( private teamsCount: number, private roundCount: number ){
        
        // Instantiates the match cost matrix and teamState counters
        this.teamStates = new Array(this.roundCount);
        this.matchCostCounts = new Array(this.roundCount);
        for(var i: number = 0; i < this.roundCount; i++ ){
            // Team states
            this.teamStates[i] = new Array(teamsCount);
            
            // Match cost counters
            this.matchCostCounts[i] = new Array(teamsCount);
            for(var j: number = 0; j < this.teamsCount; j++ ){ // Home
                this.matchCostCounts[i][j] = new Array(teamsCount);
                this.teamStates[i][j] = new Array(CostsTable.teamCounterCount);
            }
        }

        // Setting initial entry values
        this.clear();
    }

    /**
     * clear
     * Sets all matchCostCounts entries to zero (except illegal entries that 
     * are set to Costs.ILLEGAL) and sets all TeamState bitmasks to OPEN.
     */
    clear(): void {
        for(var i: number = 0; i < this.roundCount; i++ ){ // Round
            for(var j: number = 0; j < this.teamsCount; j++ ){ // Home
                // Clearing team states
                for(var k: number = 0; k < CostsTable.teamCounterCount; k++ ){
                    this.teamStates[i][j][k] = 0;
                } 
                
                // Resetting match cost counts
                for(var k: number = 0; k < this.teamsCount; k++ ){ // Away
                    if( k === j ){
                        // No teams should play against one another. Inflated cost to represent this should a bug allow it in a fixture.
                        this.matchCostCounts[i][j][k] = Costs.ILLEGAL;
                    } else {
                        this.matchCostCounts[i][j][k] = 0;
                    }
                }
            }
        }
    }

    /**
     * setMatch
     * Increments the constraint breaking costs of all matches affected by 
     * applying the given match to the CostsTable.
     * 
     * Sets the mask of the relevant teams in the the CostsTable to assist with 
     * counting home and away matches.
     * 
     * Params:
     * match - the match to impose on the CostsTable
     * 
     * Throws:
     * 'Illegal match. Cannot apply to this CostsTable.' The match parameter has 
     *   an illegal round number, home team, or away team. Most likely out of 
     *   bounds.
     */
    setMatch(match: Match): void {
        // Checking for an illegal matchup
        if( match.roundNum >= this.roundCount || match.roundNum < 0 ||
            match.homeTeam >= this.teamsCount || match.homeTeam < 0 ||
            match.awayTeam >= this.teamsCount || match.awayTeam < 0 ||
            match.homeTeam === match.awayTeam ){
            throw new Error('Illegal match. Cannot apply to this CostsTable.');
        }

        // Setting this match's effects to other rounds in the rotation
        let gamesPerRotation = this.teamsCount - 1;
        for(var i: number = Math.max(match.roundNum - (gamesPerRotation - 1), 0); i < Math.min(match.roundNum + (gamesPerRotation - 1), this.roundCount); i++){
            if( i != match.roundNum ){
                this.matchCostCounts[i][match.homeTeam][match.awayTeam] += Costs.TEAM_ROTN;
                this.matchCostCounts[i][match.awayTeam][match.homeTeam] += Costs.TEAM_ROTN;
            }
        }

        // Informing the rest of the possible matches in the round of the set match.
        for(var i: number = 0; i < this.teamsCount; i++){
            if( i != match.homeTeam && i != match.awayTeam ){
                this.matchCostCounts[match.roundNum][i][match.homeTeam] += Costs.ONE_MPTPR;
                this.matchCostCounts[match.roundNum][i][match.awayTeam] += Costs.ONE_MPTPR;
                this.matchCostCounts[match.roundNum][match.homeTeam][i] += Costs.ONE_MPTPR;
            }
            
            if( i != match.awayTeam ){
                this.matchCostCounts[match.roundNum][match.awayTeam][i] += Costs.ONE_MPTPR;
            }
        }
        
        // Setting teamState counters
        this.teamStates[match.roundNum][match.homeTeam][CostsTable.PLAYING_HOME] += 1;
        this.teamStates[match.roundNum][match.homeTeam][CostsTable.MATCH_SET] += 1;
        this.teamStates[match.roundNum][match.awayTeam][CostsTable.PLAYING_AWAY] += 1;
        this.teamStates[match.roundNum][match.awayTeam][CostsTable.MATCH_SET] += 1;
    }

    /**
     * clearMatch
     * The reverse operation of setMatch.
     * 
     * Removes the provided match from the CostsTable, including its influence on
     * surrounding cells. Does NOT alter the ILLEGAL matchstates. Does not 
     * alter anything if the provided match does not have MATCH_SET > 0 on its 
     * home and away team states for its round.
     * 
     * Params:
     * match - the match to impose on the CostsTable
     * 
     * Throws:
     * 'Illegal match. Cannot apply to this CostsTable.' The match parameter has 
     *   an illegal round number, home team, or away team. Most likely out of 
     *   bounds.
     * 'Match has not been set. Cannot remove from CostsTable.' The match does 
     *   not have the MATCH_SET counters > 0 as explained above.
     */
    clearMatch(match: Match): void {
        // Checking for an illegal matchup
        if( match.roundNum >= this.roundCount || match.roundNum < 0 ||
            match.homeTeam >= this.teamsCount || match.homeTeam < 0 ||
            match.awayTeam >= this.teamsCount || match.awayTeam < 0 ||
            match.homeTeam === match.awayTeam ){
            throw new Error('Illegal match. Cannot apply to this CostsTable.');
        }
        
        // Checking if the match has been set
        if( this.teamStates[match.roundNum][match.homeTeam][CostsTable.MATCH_SET] <= 0 || 
            this.teamStates[match.roundNum][match.awayTeam][CostsTable.MATCH_SET] <= 0 ){
            throw new Error('Match has not been set. Cannot remove from CostsTable.');
        }

        // Removing this match's effects from other rounds in the rotation
        let gamesPerRotation = this.teamsCount - 1;
        for(var i: number = Math.max(match.roundNum - (gamesPerRotation - 1), 0); i < Math.min(match.roundNum + (gamesPerRotation - 1), this.roundCount); i++){
            if( i != match.roundNum ){
                this.matchCostCounts[i][match.homeTeam][match.awayTeam] -= Costs.TEAM_ROTN;
                this.matchCostCounts[i][match.awayTeam][match.homeTeam] -= Costs.TEAM_ROTN;
            }
        }

        // Informing the rest of the possible matches in the round of the removed match.
        for(var i: number = 0; i < this.teamsCount; i++){
            if( i != match.homeTeam && i != match.awayTeam ){
                this.matchCostCounts[match.roundNum][i][match.homeTeam] -= Costs.ONE_MPTPR;
                this.matchCostCounts[match.roundNum][i][match.awayTeam] -= Costs.ONE_MPTPR;
                this.matchCostCounts[match.roundNum][match.homeTeam][i] -= Costs.ONE_MPTPR;
            }
            
            if( i != match.awayTeam ){
                this.matchCostCounts[match.roundNum][match.awayTeam][i] -= Costs.ONE_MPTPR;
            }
        }
        
        // Setting teamState counters
        this.teamStates[match.roundNum][match.homeTeam][CostsTable.PLAYING_HOME] -= 1;
        this.teamStates[match.roundNum][match.homeTeam][CostsTable.MATCH_SET] -= 1;
        this.teamStates[match.roundNum][match.awayTeam][CostsTable.PLAYING_AWAY] -= 1;
        this.teamStates[match.roundNum][match.awayTeam][CostsTable.MATCH_SET] -= 1;

    }

    /**
     * applyFixture
     * _CLEARS_ the CostsTable and applies all matches in the fixture array.
     * 
     * Use this prior to calling getFixtureCost to properly represent 
     * getFixtureCost's return value for the provided fixture.
     * 
     * The matches in the fixture array do not have to be in any particular 
     * order.
     * 
     * throws 
     * 'Illegal match. Cannot apply to this CostsTable.' (From setMatch) The 
     *   match parameter has an illegal round number, home team, or away 
     *   team. Most likely out of bounds.
     */
    applyFixture(fixture: Match[][]): void {
        this.clear();
        for( let i: number = 0; i < fixture.length; i++ ){
            for( let j: number = 0; j < fixture[i].length; j++ ){
                this.setMatch( fixture[i][j] );
            }
        }
    }

    /**
     * getMatchCost
     * Gets the broken constraint cost of applying the given match to the 
     * CostsTable. According to basic constraints.
     * 
     * Params:
     * match - the match to assess for cost.
     * homeTeam - the home Team object that can be referenced for team-based 
     *   constraints.
     * awayTeam - the away Team object that can be referenced for team-based 
     *   constraints.
     * 
     * Returns:
     * integer >= 0, number of open matches that would be set to 'not available'
     */
    getMatchCost(match: Match, homeTeam: Team, awayTeam: Team): number {
        // Adding basic constraints
        let costSum: number = this.matchCostCounts[match.roundNum][match.homeTeam][match.awayTeam];

        let counter: number;

        // Adding consecutive home/away games constraint costs where applicable
        let maxConscHome: number = homeTeam.consecutiveHomeGamesMax();
        if( maxConscHome > -1 ){
            counter = 1;

            // Looking at rounds ahead from the match
            let rndPointer = match.roundNum+1;
            while( rndPointer < this.roundCount ){
                if( this.teamStates[rndPointer][match.homeTeam][CostsTable.PLAYING_HOME] > 0 ){
                    counter++;
                    if( counter > maxConscHome ){
                        costSum += Costs.MAX_CONSEC;
                    }
                } else {
                    break;
                }
                rndPointer++;
            }

            // Looking at rounds behind from the match
            rndPointer = match.roundNum-1;
            while( 0 <= rndPointer ){
                if( this.teamStates[rndPointer][match.homeTeam][CostsTable.PLAYING_HOME] > 0 ){
                    counter++;
                    if( counter > maxConscHome ){
                        costSum += Costs.MAX_CONSEC;
                    }
                } else {
                    break;
                }
                rndPointer--;
            }


        }

        let maxConscAway: number = awayTeam.consecutiveAwayGamesMax();
        if( maxConscAway > -1 ){
            counter = 1;

            // Looking at rounds ahead from the match
            let rndPointer = match.roundNum+1;
            while( rndPointer < this.roundCount ){
                if( this.teamStates[rndPointer][match.awayTeam][CostsTable.PLAYING_AWAY] > 0 ){
                    counter++;
                    if( counter > maxConscAway ){
                        costSum += Costs.MAX_CONSEC;
                    }
                } else {
                    break;
                }
                rndPointer++;
            }

            // Looking at rounds behind from the match
            rndPointer = match.roundNum-1;
            while( 0 <= rndPointer ){
                if( this.teamStates[rndPointer][match.awayTeam][CostsTable.PLAYING_AWAY] > 0 ){
                    counter++;
                    if( counter > maxConscAway ){
                        costSum += Costs.MAX_CONSEC;
                    }
                } else {
                    break;
                }
                rndPointer--;
            }
        }

        // Adding max home/away games constraint where applicable
        let maxHome: number = homeTeam.homeGamesMax();
        if( maxHome > -1 ){
            counter = 0;
            for( let i: number = 0; i < this.roundCount; i++ ){
                if( this.teamStates[i][match.homeTeam][CostsTable.PLAYING_HOME] > 0 ){
                    counter++
                    if( counter > maxHome ){
                        costSum += Costs.MAX_H_OR_A;
                    }
                }
            }
        }

        let maxAway: number = awayTeam.awayGamesMax();
        if( maxAway > -1 ){
            counter = 0;
            for( let i: number = 0; i < this.roundCount; i++ ){
                if( this.teamStates[i][match.awayTeam][CostsTable.PLAYING_AWAY] > 0 ){
                    counter++
                    if( counter > maxAway ){
                        costSum += Costs.MAX_H_OR_A;
                    }
                }
            }
        }

        return costSum;
    }

    /**
     * fixtureCost
     * Counts up the total cost of all broken constraints according to weighted
     * costs and returns the total. 
     * 
     * The given fixture must be applied to the CostsTable before calling this 
     * function for it to fully represent the cost of the fixture in full.
     * 
     * Params:
     * fixture - an array of matches representing the fixture to be counted in 
     *   total constraint cost. Does not need to be in order.
     * teams - an array of the teams, indexable by the team numbers in fixture.
     *   These must be provided to check for team-based constraints.
     * 
     * Returns:
     * Number >0 - the total cost of broken constraints in fixture. 
     * Number =0 - There are no broken constraints in fixture.
     */
    fixtureCost(fixture: Match[][], teams: Team[]): number {

        let costSum: number = 0;

        // For each match
        for( let i: number = 0; i < fixture.length; i++ ){
            for( let j: number = 0; j < fixture[i].length; j++ ){
                // Checking for an illegal matchup
                if( fixture[i][j].roundNum >= this.roundCount || fixture[i][j].roundNum < 0 ||
                    fixture[i][j].homeTeam >= this.teamsCount || fixture[i][j].homeTeam < 0 ||
                    fixture[i][j].awayTeam >= this.teamsCount || fixture[i][j].awayTeam < 0 ||
                    fixture[i][j].homeTeam === fixture[i][j].awayTeam ){
                    costSum += Costs.ILLEGAL;
                } else {
                    costSum += this.getMatchCost(fixture[i][j], teams[fixture[i][j].homeTeam], teams[fixture[i][j].awayTeam]);
                }
            }
        }

        return costSum;
    }

    /**
     * basicFixtureCost
     * As fixtureCost, but only accounting for basic constraints (team 
     * rotation and one match per team per round).
     * 
     * This is used for rendering satisfying the basic constraints in the 
     * fixture while working out the others in alternative ways. 
     */
    basicFixtureCost(fixture: Match[][]): number {
        let costSum: number = 0;

        // For each match
        for( let i: number = 0; i < fixture.length; i++ ){
            for( let j: number = 0; j < fixture[i].length; j++ ){
                // Checking for an illegal matchup
                if( fixture[i][j].roundNum >= this.roundCount || fixture[i][j].roundNum < 0 ||
                    fixture[i][j].homeTeam >= this.teamsCount || fixture[i][j].homeTeam < 0 ||
                    fixture[i][j].awayTeam >= this.teamsCount || fixture[i][j].awayTeam < 0 ||
                    fixture[i][j].homeTeam === fixture[i][j].awayTeam ){
                    costSum += Costs.ILLEGAL;
                } else {
                    costSum += this.matchCostCounts[fixture[i][j].roundNum][fixture[i][j].homeTeam][fixture[i][j].awayTeam];
                }
            }
        }

        return costSum;
    }

    /**
     * alteredFixtureCost
     * As fixtureCost, but substituting a match in fixture for a given 
     * alternative.
     * 
     * Params:
     * fixture - as in fixtureCost
     * altMatch - the match to replace in fixture
     * altMatchIndex - the position of the match in the round array of fixture
     * teams - as in fixtureCost
     * 
     * Returns:
     * Number >0 - the total cost of broken constraints in fixture. 
     * Number =0 - There are no broken constraints in fixture.
     */
    alteredFixtureCost(fixture: Match[][], altMatch: Match, altMatchIndex: number, teams: Team[]): number {

        let costSum: number = 0;

        // For each match
        for( let i: number = 0; i < fixture.length; i++ ){
            for( let j: number = 0; j < fixture[i].length; j++ ){
                // Checking for an illegal matchup
                if( fixture[i][j].roundNum >= this.roundCount || fixture[i][j].roundNum < 0 ||
                    fixture[i][j].homeTeam >= this.teamsCount || fixture[i][j].homeTeam < 0 ||
                    fixture[i][j].awayTeam >= this.teamsCount || fixture[i][j].awayTeam < 0 ||
                    fixture[i][j].homeTeam === fixture[i][j].awayTeam ){
                    costSum += Costs.ILLEGAL;
                    continue;
                } else {
                    if( i == altMatch.roundNum && j == altMatchIndex ){
                        costSum += this.getMatchCost(altMatch, teams[altMatch.homeTeam], teams[altMatch.awayTeam]);
                    } else {
                        costSum += this.getMatchCost(fixture[i][j], teams[fixture[i][j].homeTeam], teams[fixture[i][j].awayTeam]);
                    }
                }
            }
        }

        return costSum;
    }

    /**
     * basicAlteredFixtureCost
     * As alteredFixtureCost, but only accounting for basic constraints (team 
     * rotation and one match per team per round).
     * 
     * This is used for rendering satisfying the basic constraints in the 
     * fixture while working out the others in alternative ways. 
     */
    basicAlteredFixtureCost(fixture: Match[][], altMatch: Match, altMatchIndex: number): number {
        let costSum: number = 0;

        // For each match
        for( let i: number = 0; i < fixture.length; i++ ){
            for( let j: number = 0; j < fixture[i].length; j++ ){
                // Checking for an illegal matchup
                if( fixture[i][j].roundNum >= this.roundCount || fixture[i][j].roundNum < 0 ||
                    fixture[i][j].homeTeam >= this.teamsCount || fixture[i][j].homeTeam < 0 ||
                    fixture[i][j].awayTeam >= this.teamsCount || fixture[i][j].awayTeam < 0 ||
                    fixture[i][j].homeTeam === fixture[i][j].awayTeam ){
                    costSum += Costs.ILLEGAL;
                } else {
                    if( i == altMatch.roundNum && j == altMatchIndex ){
                        costSum += this.matchCostCounts[altMatch.roundNum][altMatch.homeTeam][altMatch.awayTeam];
                    } else {
                        costSum += this.matchCostCounts[fixture[i][j].roundNum][fixture[i][j].homeTeam][fixture[i][j].awayTeam];
                    }
                }
            }
        }

        return costSum;
    }

    /**
     * printCostsToConsole
     * Prints console logs of the matchCostCounts and the input fixture.
     * Very useful for debugging.
     */
    printCostsToConsole(fixture: Match[][], teams: Team[]): void {
        console.log("===========================================");
        
        let concatStr: string = "";
        for( let i: number = 0; i < this.matchCostCounts.length; i++ ){
            concatStr = "";

            console.log("Round " + i);
            concatStr = concatStr + "  A ";
            for( let j: number = 0; j < this.matchCostCounts[i].length; j++ ){
                concatStr = concatStr + j + "  ";
            }
            concatStr = concatStr + "   H   A   S   H/A:C";

            console.log(concatStr);
            
            console.log("H");
            for( let j: number = 0; j < this.matchCostCounts[i].length; j++ ){
                concatStr = "";
                concatStr = concatStr + j + "   ";
                for( let k: number = 0; k < this.matchCostCounts[i][j].length; k++ ){
                    if( j == k ){
                        concatStr = concatStr + "X  ";    
                    } else {
                        concatStr = concatStr + this.matchCostCounts[i][j][k] + "  ";
                    }
                }
                concatStr = concatStr + "   " + this.teamStates[i][j][CostsTable.PLAYING_HOME] + "   " + this.teamStates[i][j][CostsTable.PLAYING_AWAY] + "   " + this.teamStates[i][j][CostsTable.MATCH_SET];
                
                
                if( j < (this.teamsCount/2) ){
                    concatStr = concatStr + "   " + fixture[i][j].homeTeam + "/" + fixture[i][j].awayTeam + ":" + this.getMatchCost(fixture[i][j], teams[fixture[i][j].homeTeam], teams[fixture[i][j].awayTeam]);
                    concatStr = concatStr + " (B = " + this.matchCostCounts[fixture[i][j].roundNum][fixture[i][j].homeTeam][fixture[i][j].awayTeam] + ")";
                }
                
                console.log(concatStr);
            }

            console.log("--------------------------------------");
        }
        
    }
}
