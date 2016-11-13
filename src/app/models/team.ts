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
