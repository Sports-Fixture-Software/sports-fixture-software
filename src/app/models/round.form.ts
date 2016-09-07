import { Team } from './team'
import { Round } from './round'

export interface RoundForm {
    round: Round,
    homeTeam: Team,
    awayTeam: Team
}
