interface Match {
    roundNum: number;
    homeTeam: number;
    awayTeam: number;
}

interface Team {
    /* Index is an int between 0 and total number of teams -1. Index = -1 is 
       for global (default) fixture constraints. */
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
 * plotFixture
 * 
 * Plots a fixture with enough rounds for each team to play every other at most
 * once. Uses DFS through the solution space, pruning branches that break 
 * simple constraints.
 * 
 * Params:
 * teams: Team[] The teams playing in the season fixture. These must implement
 *               the Team interface. Does NOT include team of index -1.
 * resvdMatches: Match[] The matches that are already locked in before 
 *                          generation begins. Order not needed.
 * globalCon: Team[] The constraints that apply to EVERY team if their
 *                           Team interface members are not specified.
 * 
 * Returns:
 * Match[] A complete and legal fixture. Ordering is not guaranteed. Sort by 
 *         round number for ease of plotting.
 * 
 * Throws:
 * 
 * --- There will be a lot of things to throw. This will be filled as necessary. ---
 * 
 */
function plotFixture( teams: Team[], resvdMatches: Match[], globalCon: Team[] ): Match[] {
    
    // Constraint table. Keeps track of which games are available in a 3D matrix of bitmasks
    class conTable{
        
        private games: number[][][]; //[round][Home Team Index][Away Team Index]
        private teamsCnt: number; // Number of teams. DO NOT CHANGE AFTER CONSTRUCTION.

        constructor(teams: number){
            this.teamsCnt = teams; 

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
         * TODO: Nature of unavailable matchups is down to an enum that I'll make later
         */
        getMask(round: number, home: number, away: number): number {
            // Checking for an illegal matchup
            if( round > this.teamsCnt-1 || home > this.teamsCnt || away > this.teamsCnt || home === away ){
                return -1;
            }

            // Retrieving bitmask from tables
            return this.games[round][home][away-1];
        }

        /**
         * setMatch
         * Sets the bitmask representing the availability of a paricular
         * matchup.
         * 
         * Returns:
         * false for an always-illegal matchup (e.g. team or round doesn't exist)
         * true for a successful update
         */
        setMatch(round: number, home: number, away: number, value: number): boolean {
            // Checking for an illegal matchup
            if( round > this.teamsCnt-1 || round < 0 ||
                home > this.teamsCnt    || home < 0  ||
                away > this.teamsCnt    || away < 0  || 
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
            if( round > this.teamsCnt-1 || round < 0 ){
                throw { name: 'NotARound', message: 'Round ' + round + ' is not in this conTable'};
            }

            // Copying the round.
            /* Must not be done with slice() as that copies the nested arrays 
               by reference and not by value. */ 
            var roundMatrix: number[][];
            roundMatrix = [];
            for(var i: number = 0; i < this.teamsCnt; i++){
                roundMatrix[i] = [];
                for(var j: number = 0; j < this.teamsCnt-1; j++){
                    roundMatrix[i][j] = this.games[round][i][j];
                }
            }

            return roundMatrix;
        }

        /**
         * restoreRound
         * Sets assigns values of the input round: number[][] to the round 
         * in the conTable for the purposes of restoring a previous round 
         * state. Does not mutate the inputs. The copy is performed by value.
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
            if( round > this.teamsCnt-1 || round < 0 ){
                return false;
            }

            for(var i: number = 0; i < this.teamsCnt; i++){
                for(var j: number = 0; j < this.teamsCnt-1; j++){
                    this.games[round][i][j] = roundMatrix[i][j];
                }
            }
        }
    }
}
