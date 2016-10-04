import { Team } from './team'
import { Round } from './round'
import { Match } from './match'

export interface ReviewForm {
    round: Round,
    homeTeam: Team,
    awayTeam: Team,
    match: Match
}
