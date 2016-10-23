import { databaseInjector } from '../services/database_injector'
import { DatabaseService } from '../services/database.service'
import { League } from './league'
import { TeamConfig } from './team_config'
import * as Promise from 'bluebird'

export class Team extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<Team> {

    constructor(params?: string | any) {
        if (typeof params === 'string') {
            super()
            this.name = params
        } else {
            super(params)
        }
    }

    get tableName() { return 'team'; }

    get name(): string { return this.get('name') }
    set name(value: string) { this.set('name', value) }

    setLeague(value: League) { this.set('league_id', value.id) }

    get teamConfigPreLoaded(): TeamConfig {
        return this.related('teamConfig') as TeamConfig
    }

    static ANY_TEAM_ID = -1
    static BYE_TEAM_ID: number = null

    /**
     * Needed by bookshelf to setup relationship
     */
    protected league() {
        return this.belongsTo(League)
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected teamConfig(): TeamConfig {
        return this.hasOne(TeamConfig)
    }

}
