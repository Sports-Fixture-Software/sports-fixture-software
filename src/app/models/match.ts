import { databaseInjector } from '../services/database_injector'
import { DatabaseService } from '../services/database.service'
import { Round } from './round'
import { Team } from './team'
import * as Promise from 'bluebird'

export class Match extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<Match> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'match' }

    get homeTeam_id(): number { return this.get('homeTeam_id') }
    set homeTeam_id(value: number) { this.set('homeTeam_id', value) }
    get awayTeam_id(): number { return this.get('awayTeam_id') }
    set awayTeam_id(value: number) { this.set('awayTeam_id', value) }

    get homeTeamName(): string {
        if (this.homeTeam_id == Team.ANY_TEAM_ID) {
            return 'Any'
        } else if (this.homeTeam_id == Team.BYE_TEAM_ID) {
            return 'Bye'
        } else if (this.homeTeamPreLoaded) {
            return this.homeTeamPreLoaded.name
        } else {
            return 'undefined'
        }
    }
    get awayTeamName(): string {
        if (this.awayTeam_id == Team.ANY_TEAM_ID) {
            return 'Any'
        } else if (this.awayTeam_id == Team.BYE_TEAM_ID) {
            return 'Bye'
        } else if (this.awayTeamPreLoaded) {
            return this.awayTeamPreLoaded.name
        } else {
            return 'undefined'
        }
    }

    setRound(value: Round) { this.set('round_id', value.id) }
    set round_id(value: number) { this.set('round_id', value) }

    get homeTeamPreLoaded(): Team {
        return this.related('homeTeam') as Team
    }
    setHomeTeam(value: Team) { this.set('homeTeam_id', value.id) }

    get awayTeamPreLoaded(): Team {
        return this.related('awayTeam') as Team
    }
    setAwayTeam(value: Team) { this.set('awayTeam_id', value.id) }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected round() {
        return this.belongsTo(Round)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected homeTeam() {
        return this.belongsTo(Team, 'homeTeam_id')
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected awayTeam() {
        return this.belongsTo(Team, 'awayTeam_id')
    }
}
