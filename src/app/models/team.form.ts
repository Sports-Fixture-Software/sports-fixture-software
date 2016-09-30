import { Team } from './team'

export interface TeamForm {
    name: string,
    homeGamesMin: string,
    homeGamesMax: string,
    homeGamesEnabled: boolean,
    awayGamesMin: string,
    awayGamesMax: string,
    awayGamesEnabled: boolean,
    team: Team
}
