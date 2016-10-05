import { databaseInjector } from '../bootstrap'
import { DatabaseService } from '../services/database.service'
import { League } from './league'

export class LeagueConfig extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<LeagueConfig> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'leagueconfig' }

    get priority(): number { return this.get('priority') }
    set priority(value: number) { this.set('priority', value) }
    get consecutiveHomeGamesMax(): number { return this.get('consecutiveHomeGamesMax') }
    set consecutiveHomeGamesMax(value: number) { this.set('consecutiveHomeGamesMax', value) }
    get consecutiveAwayGamesMax(): number { return this.get('consecutiveAwayGamesMax') }
    set consecutiveAwayGamesMax(value: number) { this.set('consecutiveAwayGamesMax', value) }

    setLeague(league: League) {
        this.set('league_id', league.id)
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected league() {
        return this.belongsTo(League)
    }
}
