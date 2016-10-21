/**
 * League
 */
import { databaseInjector } from '../services/database_injector'
import { DatabaseService } from '../services/database.service'
import { Collection } from '../services/collection'
import { Fixture } from './fixture'
import { Team } from './team'
import { LeagueConfig } from './league_config'
import * as Promise from 'bluebird'

export class League extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<League> {

    constructor(params?: string | any) {
        if (typeof params === 'string') {
            super()
            this.name = params
        } else {
            super(params)
        }
    }

    get tableName() { return 'league'; }
    get name(): string { return this.get('name') }
    set name(value: string) { this.set('name', value) }

    get teamsPreLoaded(): Collection<Team> {
        return this.related('teams') as Collection<Team>
    }

    get leagueConfigPreLoaded(): LeagueConfig {
        return this.related('leagueConfig') as LeagueConfig
    }

    get fixturesPreLoaded(): Collection<Fixture> {
        return this.related('fixtures') as Collection<Fixture>
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected fixtures(): Collection<Fixture> {
        return this.hasMany(Fixture)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected teams(): Collection<Team> {
        return this.hasMany(Team)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected leagueConfig(): LeagueConfig {
        return this.hasOne(LeagueConfig)
    }
}
