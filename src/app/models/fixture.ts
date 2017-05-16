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
import { Round } from './round'
import { Collection } from '../services/collection'
import { FixtureConfig } from './fixture_config'
import * as Promise from 'bluebird'
import * as moment from 'moment'

export class Fixture extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<Fixture> {

    constructor(params?: string | any) {
        if (typeof params === 'string') {
            super()
            this.name = params
        } else {
            super(params)
        }
    }

    get tableName() { return 'fixture'; }

    get name(): string { return this.get('name') }
    set name(value: string) { this.set('name', value) }
    set description(value: string) { this.set('description', value) }
    get description(): string { return this.get('description') }
    set startDate(value: moment.Moment) { this.set('startDate', value.valueOf()) }
    get startDate(): moment.Moment { return moment(this.get('startDate')) }
    set endDate(value: moment.Moment) { this.set('endDate', value.valueOf()) }
    get endDate(): moment.Moment { return moment(this.get('endDate')) }
    set createdOn(value: moment.Moment) { this.set('createdOn', value.valueOf()) }
    get createdOn(): moment.Moment { return moment(this.get('createdOn')) }
    set createdBy(value: string) { this.set('createdBy', value) }
    get createdBy(): string { return this.get('createdBy') }
    set generatedOn(value: moment.Moment) { this.set('generatedOn', value.valueOf()) }
    get generatedOn(): moment.Moment { return moment(this.get('generatedOn')) }
    set generatedBy(value: string) { this.set('generatedBy', value) }
    get generatedBy(): string { return this.get('generatedBy') }

    setLeague(value: League) { this.set('league_id', value.id) }

    get fixtureConfigPreLoaded(): FixtureConfig {
        return this.related('fixtureConfig') as FixtureConfig
    }

    get leaguePreLoaded(): League {
        return this.related('league') as League
    }

    get roundsPreLoaded(): Collection<Round> {
        return this.related('rounds') as Collection<Round>
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected league() {
        return this.belongsTo(League)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected rounds(): Collection<Round> {
        return this.hasMany(Round)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected fixtureConfig(): FixtureConfig {
        return this.hasOne(FixtureConfig)
    }
}
