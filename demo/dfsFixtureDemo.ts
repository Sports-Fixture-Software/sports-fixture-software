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
    
    
}
