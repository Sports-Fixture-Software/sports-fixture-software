import { Match, Team, MatchState, ConTable } from './FixtureConstraints';

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
        // CHANGE setMask TO A NEW APPLICATION FUNCTION THAT DOES THE CASCADES AND CHECKS ON THE CONTABLE
        matchupState.setMask(match.roundNum, match.homeTeam, match.awayTeam, MatchState.RESERVED );

    }

}
