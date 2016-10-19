import { databaseInjector } from '../services/database_injector'
import { DatabaseService } from '../services/database.service'
import { Team } from './team'

export class TeamConfig extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<TeamConfig> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'teamconfig' }

    get priority(): number { return this.get('priority') }
    set priority(value: number) { this.set('priority', value) }
    get homeGamesMin(): number { return this.get('homeGamesMin') }
    set homeGamesMin(value: number) { this.set('homeGamesMin', value) }
    get homeGamesMax(): number { return this.get('homeGamesMax') }
    set homeGamesMax(value: number) { this.set('homeGamesMax', value) }
    get awayGamesMin(): number { return this.get('awayGamesMin') }
    set awayGamesMin(value: number) { this.set('awayGamesMin', value) }
    get awayGamesMax(): number { return this.get('awayGamesMax') }
    set awayGamesMax(value: number) { this.set('awayGamesMax', value) }

    setTeam(team: Team) {
        this.set('team_id', team.id)
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected team() {
        return this.belongsTo(Team)
    }
}
