
export interface Match {
    roundNum: number;
    homeTeam: number;
    awayTeam: number;
}

export interface Team {
    /** Index is an int between 0 and total number of teams -1. 
     *  Index = -1 is for global (default) fixture constraints.
     *  Index = 0 should be reserved for a bye team if there are an odd number
     *  of teams in the league.
     */
    index: number; 

    // Below are constraint variables.
    // To let a team default to global constraints, set these to -1
    maxHomeGames: number;
    minHomeGames: number;
    maxAwayGames: number;
    minAwayGames: number;
    // Other constraint parameters may be added here later. 
}

/**
 * MatchState
 * Enumeration to help with updating matches in the ConTable class.
 * Match states >= 0 are unavailable in some form or fashion.
 */
export enum MatchState {
    OPEN = 0,                   // Matchup is available
    HOME_PLAYING_HOME = 1,      // The HOME team in this matchup is in another HOME match this round and is unavailable
    AWAY_PLAYING_HOME = 1 << 1, // The AWAY team in this matchup is in another HOME match this round and is unavailable
    AWAY_PLAYING_AWAY = 1 << 2, // The AWAY team in this matchup is in another AWAY match this round and is unavailable
    HOME_PLAYING_AWAY = 1 << 3, // The HOME team in this matchup is in another AWAY match this round and is unavailable
    MATCH_SET = 1 << 4,         // This match has already been set in another round in this rotation 
    RESERVED = 1 << 5           // This match has been set from the start and may not be changed
}



/** Constraint table. Keeps track of which games are available in a 3D 
 *  matrix of bitmasks.
 */
export class ConTable {
    
    private games: number[][][]; //[round][Home Team Index][Away Team Index]

    constructor(private teamsCount: number){ 
        // Instantiates the round matrices to zero in all entries
        // Table is big enough for a full rotation over all teams.
        this.games = [];
        for(var i: number = 0; i < teams-1; i++ ){
            this.games[i] = [];

            for(var j: number = 0; j < teams; j++ ){
                this.games[i][j] = [];

                /* Away teams are placed back one place to cover unused 
                space where home team = away team. */
                for(var k: number = 0; k < teams-1; k++ ){
                    this.games[i][j][k] = 0;
                }
            }

        }
    }

    /**
     * getMask
     * Gets the bitmask representing the availability of a particular 
     * matchup. 
     * 
     * Returns:
     * -1 for an always-illegal matchup (e.g. team or round doesn't exist)
     * 0 for an available matchup
     * >0 for a matchup that has been made unavailable by another matchup.
     */
    getMask(round: number, home: number, away: number): number {
        // Checking for an illegal matchup
        if( round > this.teamsCount-1 || 
            home > this.teamsCount    ||
            away > this.teamsCount    || 
            home === away ){
            return -1;
        }

        // Retrieving bitmask from tables
        return this.games[round][home][away-1];
    }

    /**
     * setMask
     * Sets the bitmask representing the availability of a particular
     * matchup.
     * 
     * Returns:
     * false for an always-illegal matchup (e.g. team or round doesn't exist)
     * true for a successful update
     */
    setMask(round: number, home: number, away: number, value: number): boolean {
        // Checking for an illegal matchup
        if( round > this.teamsCount-1 || round < 0 ||
            home > this.teamsCount    || home < 0  ||
            away > this.teamsCount    || away < 0  || 
            home === away ){
            return false;
        }

        this.games[round][home][away-1] = value;
    }

    /**
     * sliceRound
     * Provides a copy of the selected round matrix for restoring if a 
     * branch of the search tree is rejected.
     * 
     * Returns:
     * A copy by value of games[round]
     * 
     * Throws:
     * NotARound: Round does not exist
     */
    sliceRound(round: number): number[][] {
        // Checking for illegal round
        if( round > this.teamsCount-1 || round < 0 ){
            throw { name: 'NotARound', message: 'Round ' + round + ' is not in this conTable'};
        }

        // Copying the round.
        /* Must not be done with slice() as that copies the nested arrays 
        by reference and not by value. */ 
        var roundMatrix: number[][];
        roundMatrix = [];
        for(var i: number = 0; i < this.teamsCount; i++){
            roundMatrix[i] = [];
            for(var j: number = 0; j < this.teamsCount-1; j++){
                roundMatrix[i][j] = this.games[round][i][j];
            }
        }

        return roundMatrix;
    }

    /**
     * restoreRound
     * Assigns values of the input round: number[][] to the round in the
     * conTable for the purposes of restoring a previous round state. 
     * Does not mutate the inputs as the copy is performed by value.
     * 
     * This does not sanity check. ONLY input rounds generated from the 
     * sliceRound() function, otherwise the whole state machine could screw
     * up.
     * 
     * Returns:
     * true if setting successful
     * false if the specified round does not exist 
     */
    restoreRound(roundMatrix: number[][], round: number): boolean {
        // Checking for illegal round
        if( round > this.teamsCount-1 || round < 0 ){
            return false;
        }

        for(var i: number = 0; i < this.teamsCount; i++){
            for(var j: number = 0; j < this.teamsCount-1; j++){
                this.games[round][i][j] = roundMatrix[i][j];
            }
        }

        return true;
    }
}
