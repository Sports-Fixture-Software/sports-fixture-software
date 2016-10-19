import { databaseInjector } from '../services/database_injector'
import { DatabaseService } from '../services/database.service'
import { Round } from './round'
import { Team } from './team'
import * as Promise from 'bluebird'

export class MatchConfig extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<MatchConfig> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'matchconfig' }

    get priority(): number { return this.get('priority') }
    set priority(value: number) { this.set('priority', value) }
    get homeTeam_id(): number { return this.get('homeTeam_id') }
    set homeTeam_id(value: number) { this.set('homeTeam_id', value) }
    get awayTeam_id(): number { return this.get('awayTeam_id') }
    set awayTeam_id(value: number) { this.set('awayTeam_id', value) }

    getRound(): Promise<Round> {
        return this.fetch({ withRelated: ['round'] }).then((res) => {
            return res.related('round') as Round
        })
    }
    setRound(value: Round) { this.set('round_id', value.id) }

    getHomeTeam(): Promise<Team> {
        return this.fetch({ withRelated: ['homeTeam'] }).then((res) => {
            return res.related('homeTeam') as Team
        })
    }
    get homeTeamPreLoaded(): Team {
        return this.related('homeTeam') as Team
    }
    setHomeTeam(value: Team) { this.set('homeTeam_id', value.id) }

    getAwayTeam(): Promise<Team> {
        return this.fetch({ withRelated: ['awayTeam'] }).then((res) => {
            return res.related('awayTeam') as Team
        })
    }
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
