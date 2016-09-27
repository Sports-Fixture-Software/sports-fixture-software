import { Team } from './team'

export interface TeamForm {
    name: string,
    homeGamesMin: number,
    homeGamesMax: number,
    homeGamesEnabled: boolean,
    awayGamesMin: number,
    awayGamesMax: number,
    awayGamesEnabled: boolean,
    team: Team
}
