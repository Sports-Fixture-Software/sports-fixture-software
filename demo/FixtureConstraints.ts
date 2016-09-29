
export class Match {
    constructor( 
        public roundNum: number,
        public homeTeam: number,
        public awayTeam: number ){}
}

/**
 * PLACEHOLDER FOR THE CONSTRAINT ENUMERATION THAT COMES WITH THE CONSTRAINT
 * FUNCTION FACTORY TO BE DEVELOPED LATER ON. 
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
 * FixtureInterface
 * Interface to retrieve matches from a fixture representation. Used primarily
 * for constraint checking.
 */
export interface FixtureInterface {
    /**
     * getHomeTeamVs
     * Returns the index of the home team vs. awayTeam on the given round.
     * Returns -1 if a game where the awayTeam is playing does not exist on the
     *   given round.
     */
    getHomeTeamVs( round: number, awayTeam: number ): number;

    /**
     * getAwayTeamVs
     * Returns the index of the away team vs. homeTeam on the given round.
     * Returns -1 if a game where the homeTeam is playing does not exist on the
     *   given round.
     */
    getAwayTeamVs( round: number, homeTeam: number ): number;
}

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
    MATCH_SET = 1 << 4,         // This match has already been set in this rotation, perhaps in another round 
    RESERVED = 1 << 5,          // This match has been set from the start and may not be changed
    ILLEGAL = 1 << 6,           // Matchup cannot be used (negative team/round number, etc.)
    NOT_SET = 0xFFFF^MATCH_SET, // Inverse bitmasks. Used for clearing matches from a ConTable.
    NOT_HPH = 0xFFFF^HOME_PLAYING_HOME,
    NOT_APH = 0xFFFF^AWAY_PLAYING_HOME,
    NOT_APA = 0xFFFF^AWAY_PLAYING_AWAY,
    NOT_HPA = 0xFFFF^HOME_PLAYING_AWAY
}

/** Constraint table. Keeps track of which games are available in a 3D 
 *  matrix of bitmasks.
 */
export class ConTable implements FixtureInterface {
    
    private games: number[][][]; //[round][Home Team Index][Away Team Index]

    constructor(private teamsCount: number){ 
        // Instantiates the round matrices to zero in all entries
        // Table is big enough for a full rotation over all teams.
        this.games = new Array(teamsCount-1);
        for(var i: number = 0; i < teamsCount-1; i++ ){ // Round
            this.games[i] = new Array(teamsCount);

            for(var j: number = 0; j < teamsCount; j++ ){ // Home
                this.games[i][j] = new Array(teamsCount);

                for(var k: number = 0; k < teamsCount; k++ ){ // Away
                    if( k === j ){
                        this.games[i][j][k] = MatchState.ILLEGAL; 
                    } else {
                        this.games[i][j][k] = MatchState.OPEN;
                    }
                }
            }

        }
    }

    // INTERFACE FUNCTIONS
    getHomeTeamVs( round: number, awayTeam: number ): number {
        for( var i: number = 0; i < this.teamsCount; i++ ){
            if( (this.games[round][i][awayTeam] & MatchState.MATCH_SET) === MatchState.MATCH_SET ){
                return i;
            }
        }

        return -1;
    }

    getAwayTeamVs( round: number, homeTeam: number ): number {
        for( var i: number = 0; i < this.teamsCount; i++ ){
            if( (this.games[round][homeTeam][i] & MatchState.MATCH_SET) === MatchState.MATCH_SET ){
                return i;
            }
        }

        return -1;
    }


    /**
     * getMask
     * Gets the bitmask representing the availability of a particular 
     * matchup. 
     * 
     * Returns from the MatchState enum:
     * MatchState.ILLEGAL for an always-illegal matchup (e.g. team or round doesn't exist)
     * MatchState.OPEN for an available matchup
     * >0 for a matchup that has been made unavailable by another matchup.
     */
    getMask(match: Match): number {
        // Checking for an illegal matchup
        if( match.roundNum > this.teamsCount || match.roundNum < 0 ||
            match.homeTeam > this.teamsCount || match.homeTeam < 0 ||
            match.awayTeam > this.teamsCount || match.awayTeam < 0 ||
            match.homeTeam === match.awayTeam ){
            return MatchState.ILLEGAL;
        }

        // Retrieving bitmask from tables
        return this.games[match.roundNum][match.homeTeam][match.awayTeam];
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
    setMask(match: Match, value: number): boolean {
        // Checking for an illegal matchup
        if( this.getMask(match) === MatchState.ILLEGAL ){
            return false;
        }

        this.games[match.roundNum][match.homeTeam][match.awayTeam] = value;
        return true;
    }

    /**
     * setMatch
     * Sets the mask of a match to the ConTable and then sets the surrounding
     * masks appropriately in the round to reflect the match being committed.
     * Use this and not setMask to commit matches.
     * 
     * This function does not sanity check. Beyond checking that the match is 
     * availableMake sure that you have sliced the round before calling this 
     * function in case you need to roll back.
     * 
     * Returns:
     * false for an always-illegal matchup (e.g. team or round doesn't exist
     * or the match is not available to set onto.)
     * true for a successful update
     */
    setMatch(match: Match, state: number = MatchState.MATCH_SET): boolean {
        // Checking for an illegal matchup
        if( this.getMask(match) !== MatchState.OPEN  ){
            return false;
        }
        
        // Setting this match in the fixture
        for(var i: number = 0; i < this.teamsCount-1; i++){
            this.games[i][match.homeTeam][match.awayTeam] = state;
        }

        // Informing the rest of the possible matches in the round of the set match.
        for(var i: number = 0; i < this.teamsCount; i++){
            this.games[match.roundNum][i][match.awayTeam] |= MatchState.AWAY_PLAYING_AWAY;
            this.games[match.roundNum][i][match.homeTeam] |= MatchState.AWAY_PLAYING_HOME;
            this.games[match.roundNum][match.awayTeam][i] |= MatchState.HOME_PLAYING_AWAY;
            this.games[match.roundNum][match.homeTeam][i] |= MatchState.HOME_PLAYING_HOME;
        }
        
        return true;
    }

    /**
     * clearMatch
     * Removes the provide match from the ConTable, including its influence on
     * surrounding cells. Does NOT alter the RESERVED and ILLEGAL matchstates.
     * 
     * Returns:
     * True if match successfully cleared
     * False if the match specified does not have the MATCH_SET state or if 
     *    match is illegal.
     */
    clearMatch(match: Match): boolean {
        // Checking for an illegal matchup
        if( this.getMask(match) === MatchState.ILLEGAL ||
            this.getMask(match) === MatchState.OPEN ){
            return false;
        }
        
        // Clearing this match in the fixture
        for(var i: number = 0; i < this.teamsCount-1; i++){
            this.games[i][match.homeTeam][match.awayTeam] &= MatchState.NOT_SET;
        }

        // Informing the rest of the possible matches in the round of the cleared match.
        for(var i: number = 0; i < this.teamsCount; i++){
            this.games[match.roundNum][i][match.awayTeam] &= MatchState.NOT_APA;
            this.games[match.roundNum][i][match.homeTeam] &= MatchState.NOT_APH;
            this.games[match.roundNum][match.awayTeam][i] &= MatchState.NOT_HPA;
            this.games[match.roundNum][match.homeTeam][i] &= MatchState.NOT_HPH;
        }

        return true;
    }

    /**
     * sliceRound
     * Provides a copy of the selected round matrix for restoring if a 
     * branch of the search tree is rejected. 
     * (Does not backtrack MATCH_SET states in all rounds.)
     * 
     * Returns:
     * A copy by value of games[round]
     * 
     * Throws:
     * Round X is not in conTable (does not exist)
     */
    sliceRound(round: number): number[][] {
        // Checking for illegal round
        if( round > this.teamsCount || round < 0 ){
            throw new Error('Round ' + round + ' is not in this conTable');
        }

        // Copying the round.
        /* Must not be done with slice() as that copies the nested arrays 
        by reference and not by value. */ 
        var roundMatrix: number[][];
        roundMatrix = [];
        for(var i: number = 0; i < this.teamsCount; i++){
            roundMatrix[i] = [];
            for(var j: number = 0; j < this.teamsCount; j++){
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
     * (Does not backtrack MATCH_SET states in all rounds.)
     * 
     * Returns:
     * true if setting successful
     * false if the specified round does not exist 
     */
    restoreRound(roundMatrix: number[][], round: number): boolean {
        // Checking for illegal round
        if( round > this.teamsCount || round < 0 ){
            return false;
        }

        for(var i: number = 0; i < this.teamsCount; i++){
            for(var j: number = 0; j < this.teamsCount; j++){
                this.games[round][i][j] = roundMatrix[i][j];
            }
        }

        return true;
    }
}
