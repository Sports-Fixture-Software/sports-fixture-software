import { Team } from './team'
import { Round } from './round'
import { MatchConfig } from './match_config'

export interface RoundForm {
    round: Round,
    homeTeam: Team,
    awayTeam: Team,
    config: MatchConfig
}
