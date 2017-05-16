/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

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
