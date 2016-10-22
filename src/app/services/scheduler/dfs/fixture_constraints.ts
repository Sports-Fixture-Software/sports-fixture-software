import { Constraint } from '../../../util/constraint_factory'

/**
 * Match struct
 * Used for representing individual matches in fixtures.
 * the footPrnt member is used by look-ahead to follow the min-conflict
 * heuristic and may be ignored otherwise. 
 */
export class Match {
    constructor( 
        public roundNum: number,
        public homeTeam: number,
        public awayTeam: number, 
        public footPrnt: number = 0 ){}
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

interface RotationRange {
    startRound: number,
    endRound: number
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
    MATCH_IN_ROUND = 1 << 5,    // This match has already been set in this round 
    RESERVED = 1 << 6,          // This match has been set from the start and may not be changed
    ILLEGAL = 1 << 7,           // Matchup cannot be used (negative team/round number, etc.)
    NOT_SET = 0xFFFF^MATCH_SET, // Inverse bitmasks. Used for clearing matches from a ConTable.
    NOT_MIR = 0xFFFF^MATCH_IN_ROUND,
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
    private rotations: RotationRange[] // the start and end round for each
    // rotation
    domainOfRound: number[];

    constructor(private teamsCount: number, private roundCount: number, reservedByesPerRound: number[]) {
        this.domainOfRound = new Array(this.roundCount);
        // Instantiates the round matrices to zero in all entries
        // Table is big enough for a full rotation over all teams.
        this.games = new Array(this.roundCount);
        for (var i: number = 0; i < this.roundCount; i++) { // Round
            this.games[i] = new Array(teamsCount);
            this.domainOfRound[i] = (teamsCount * teamsCount) - teamsCount;

            for (var j: number = 0; j < teamsCount; j++) { // Home
                this.games[i][j] = new Array(teamsCount);

                for (var k: number = 0; k < teamsCount; k++) { // Away
                    if (k === j) {
                        this.games[i][j][k] = MatchState.ILLEGAL;
                    } else {
                        this.games[i][j][k] = MatchState.OPEN;
                    }
                }
            }
        }

        let gamesPerRound = teamsCount / 2
        let roundsPerRotationWithoutByes = teamsCount - 1
        for (let i = 0; i < roundCount; i += roundsPerRotationWithoutByes) {
            this.rotations.push({ startRound: i, endRound: Math.min(i + roundsPerRotationWithoutByes - 1, roundCount - 1)}) 
        }
        for (let i = 0; i < this.rotations.length; i++) {
            let extraRounds = 0
            let byeCount = 0
            let rotation = this.rotations[i]
            let shuffleAmount = rotation.endRound
            for (let j = rotation.startRound; j <= rotation.endRound; j++) {
                // if there is only one less bye that games per round, then
                // there is only 
                if (gamesPerRound - reservedByesPerRound[j] <= 1) {
                    extraRounds++
                } else {
                    byeCount += reservedByesPerRound[j]
                }
            }
            // determine bye overflow rounds, remembering there may be user set
            // byes in the overflow rounds
            for (j = rotation.endRound + 1; j < reservedByesPerRound.length; j++) {
                byeCount -= (gamesPerRound - reservedByesPerRound[j])
                if (byeCount <= 0) {
                    rotation.endRound = j
                    break
                }
            }
            // determine extra rounds, remembering there may be user set
            // byes in the extra rounds
            for (j = rotation.endRound + 1; j < reservedByesPerRound.length; j++) {
                if (gamesPerRound - reservedByesPerRound[j] > 0) {
                    extraRounds--
                }
                if (extraRounds <= 0) {
                    rotation.endRound = j
                    break
                }
            }
            if (byeCount > 0 || extraRounds > 0) {
                rotation.endRound = roundCount - 1
                break
            }
            // shuffle
            shuffleAmount = rotation.endRound - shuffleAmount
            if (shuffleAmount > 0) {
                for (j = i + 1; j < this.rotations.length; j++) {
                    this.rotations[j].startRound += shuffleAmount
                    this.rotations[j].endRound = Math.min(this.rotations[j].endRound + shuffleAmount, roundCount - 1)
                }
            }    
        }
        for (let i = 0; i < this.rotations.length; i++) {
            if (this.rotations[i].endRound >= roundCount &&
                i + 1 < this.rotations.length) {
                this.rotations.splice(i + 1, this.rotations.length - i + 1)
                break
            }
        }
    }

    private getRotation(roundNum: number) {
        for (let i = 0; i < this.rotations.length; i++) {
            if (roundNum >= this.rotations[i].startRound && roundNum <= this.rotations[i].endRound) {
                return i
            }
        }
        return 0
    }

    // INTERFACE FUNCTIONS
    getHomeTeamVs( round: number, awayTeam: number ): number {
        if( !(round >= this.roundCount    || round < 0    ||
              awayTeam >= this.teamsCount || awayTeam < 0)){
            
            for( var i: number = 0; i < this.teamsCount; i++ ){
                if( (this.games[round][i][awayTeam] & MatchState.MATCH_IN_ROUND) === MatchState.MATCH_IN_ROUND ){
                    return i;
                }
            }
        
        }

        return -1;
    }

    getAwayTeamVs( round: number, homeTeam: number ): number {
        if( !(round >= this.roundCount    || round < 0    ||
              homeTeam >= this.teamsCount || homeTeam < 0)){
            
            for( var i: number = 0; i < this.teamsCount; i++ ){
                if( (this.games[round][homeTeam][i] & MatchState.MATCH_IN_ROUND) === MatchState.MATCH_IN_ROUND ){
                    return i;
                }
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
        if( match.roundNum >= this.roundCount || match.roundNum < 0 ||
            match.homeTeam >= this.teamsCount || match.homeTeam < 0 ||
            match.awayTeam >= this.teamsCount || match.awayTeam < 0 ||
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
        if( this.getMask(match) !== MatchState.OPEN ){
            return false;
        }
                
        // Setting this match in the round
        this.games[match.roundNum][match.homeTeam][match.awayTeam] |= MatchState.MATCH_IN_ROUND;

        let gamesPerRound = this.teamsCount - 1
        let rotationNum = Math.floor(match.roundNum / gamesPerRound)

        // Setting this match in the fixture
        for(var i: number = rotationNum*gamesPerRound; i < Math.min((rotationNum*gamesPerRound) + gamesPerRound, this.roundCount); i++){
            this.games[i][match.homeTeam][match.awayTeam] |= state;
            this.games[i][match.awayTeam][match.homeTeam] |= state;
            this.domainOfRound[i] -= 2;
        }

        // Informing the rest of the possible matches in the round of the set match.
        for(var i: number = 0; i < this.teamsCount; i++){

            if( this.games[match.roundNum][i][match.awayTeam] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] -= 1;
            }

            this.games[match.roundNum][i][match.awayTeam] |= MatchState.AWAY_PLAYING_AWAY;
            
            if( this.games[match.roundNum][i][match.homeTeam] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] -= 1;
            }

            this.games[match.roundNum][i][match.homeTeam] |= MatchState.AWAY_PLAYING_HOME;
            
            if( this.games[match.roundNum][match.awayTeam][i] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] -= 1;
            }

            this.games[match.roundNum][match.awayTeam][i] |= MatchState.HOME_PLAYING_AWAY;
            
            if( this.games[match.roundNum][match.homeTeam][i] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] -= 1;
            }

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
        
        // Clearing this match in the round
        this.games[match.roundNum][match.homeTeam][match.awayTeam] &= MatchState.NOT_MIR;

        let gamesPerRound = this.teamsCount - 1
        let rotationNum = Math.floor(match.roundNum / gamesPerRound)

        // Clearing this match in the fixture
        for(var i: number = rotationNum*gamesPerRound; i < Math.min((rotationNum*gamesPerRound) + gamesPerRound, this.roundCount); i++){
            this.games[i][match.homeTeam][match.awayTeam] &= MatchState.NOT_SET;
            this.games[i][match.awayTeam][match.homeTeam] &= MatchState.NOT_SET;
            this.domainOfRound[i] += 2;
        }

        // Informing the rest of the possible matches in the round of the cleared match.
        for(var i: number = 0; i < this.teamsCount; i++){
            this.games[match.roundNum][i][match.awayTeam] &= MatchState.NOT_APA;

            if( this.games[match.roundNum][i][match.awayTeam] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] += 1;
            }

            this.games[match.roundNum][i][match.homeTeam] &= MatchState.NOT_APH;

            if( this.games[match.roundNum][i][match.homeTeam] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] += 1;
            }

            this.games[match.roundNum][match.awayTeam][i] &= MatchState.NOT_HPA;
            
            if( this.games[match.roundNum][match.awayTeam][i] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] += 1;
            }

            this.games[match.roundNum][match.homeTeam][i] &= MatchState.NOT_HPH;

            if( this.games[match.roundNum][match.homeTeam][i] == MatchState.OPEN ){
                this.domainOfRound[match.roundNum] += 1;
            }
        }

        return true;
    }

    /**
     * getFootPrint
     * Calculates the number of other matchups that will be rendered illegal by 
     * the supplied match if it was to be applied to the conTable. Can be used 
     * for obtaining values to fill a Match's footPrnt member variable.
     * 
     * This function is forgiving. It will give you an answer even if the 
     * proposed matchup is not available in the first place. 
     * 
     * Returns:
     * integer >= 0, number of open matches that would be set to 'not available'
     */
    calcFootPrint(match: Match): number {
        var openGamesOverlapped: number = 0;

        let gamesPerRound = this.teamsCount - 1
        let rotationNum = Math.floor(match.roundNum / gamesPerRound)

        // Footprint throughout other rounds
        for(var i: number = rotationNum*gamesPerRound; i < Math.min((rotationNum*gamesPerRound) + gamesPerRound, this.roundCount); i++){
            if( i != match.roundNum ){
                if( this.games[i][match.homeTeam][match.awayTeam] == MatchState.OPEN ){
                    openGamesOverlapped += 1;
                }

                if( this.games[i][match.awayTeam][match.homeTeam] == MatchState.OPEN ){
                    openGamesOverlapped += 1;
                }
            }
        }

        // Footprint within the round of the match
        for(var i: number = 0; i < this.teamsCount; i++){

            if ( i != match.awayTeam ) {
                if( this.games[match.roundNum][i][match.awayTeam] == MatchState.OPEN ){
                    openGamesOverlapped += 1;
                }

                if( this.games[match.roundNum][match.awayTeam][i] == MatchState.OPEN ){
                    openGamesOverlapped += 1;
                }
            }

            if ( i != match.homeTeam ) {
                if( this.games[match.roundNum][i][match.homeTeam] == MatchState.OPEN ){
                    openGamesOverlapped += 1;
                }

                if( this.games[match.roundNum][match.homeTeam][i] == MatchState.OPEN ){
                    openGamesOverlapped += 1;
                }
            }

        }

        return openGamesOverlapped;
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
