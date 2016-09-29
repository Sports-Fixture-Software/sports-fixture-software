import { databaseInjector } from '../bootstrap'
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

    getLeague(): Promise<League> {
        return this.fetch({ withRelated: ['league'] }).then((res) => {
            return res.related('league') as League
        })
    }
    setLeague(value: League) { this.set('league_id', value.id) }

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
