import { ConTable } from './ConTable';

interface Match {
    roundNum: number;
    homeTeam: number;
    awayTeam: number;
}

interface Team {
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
enum MatchState {
    OPEN = 0, // Matchup is available
    HOME_PLAYING_HOME = 1,      // The HOME team in this matchup is in another HOME match this round and is unavailable
    AWAY_PLAYING_AWAY = 1 << 1, // The AWAY team in this matchup is in another AWAY match this round and is unavailable
    HOME_PLAYING_AWAY = 1 << 2, // The HOME team in this matchup is in another AWAY match this round and is unavailable
    AWAY_PLAYING_HOME = 1 << 3, // The AWAY team in this matchup is in another HOME match this round and is unavailable
    MATCH_SET = 1 << 4, // This match has already been set in another round in this rotation 
    RESERVED = 1 << 5 // This match has been set from the start and may not be changed
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
 * 
 */
function plotFixture( teams: Team[], resvdMatches: Match[], globalCon: Team ): Match[] {
    
    // Checking for odd number of teams
    if( teams.length % 2 != 1 ){
        throw new Error('Odd number of teams in the teams parameter. Add or remove a bye to make it even.');
    }

    // Creating and populating matrix that stores the matchup states.
    var matchupState: ConTable = new ConTable( teams.length );

    for( let match of resvdMatches ){
        matchupState.setMask(match.roundNum, match.homeTeam, match.awayTeam, )
    }

}
