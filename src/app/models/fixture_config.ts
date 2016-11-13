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
import { Fixture } from './fixture'

export class FixtureConfig extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<FixtureConfig> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'fixtureconfig' }

    get priority(): number { return this.get('priority') }
    set priority(value: number) { this.set('priority', value) }
    get consecutiveHomeGamesMax(): number { return this.get('consecutiveHomeGamesMax') }
    set consecutiveHomeGamesMax(value: number) { this.set('consecutiveHomeGamesMax', value) }
    get consecutiveAwayGamesMax(): number { return this.get('consecutiveAwayGamesMax') }
    set consecutiveAwayGamesMax(value: number) { this.set('consecutiveAwayGamesMax', value) }

    setFixture(fixture: Fixture) {
        this.set('fixture_id', fixture.id)
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected fixture() {
        return this.belongsTo(Fixture)
    }
}
