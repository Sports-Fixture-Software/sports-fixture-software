/**
 * Team
 * Interface to represent a team in a fixture to allow the fixture to check
 * against the team's constraints.
 */
export interface Team {
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
