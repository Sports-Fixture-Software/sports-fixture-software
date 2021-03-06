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

import { DatabaseService } from '../../app/services/database.service'
import { AppConfig } from '../../app/util/app_config'
import * as fs from 'fs'

/**
 * Unit tests for the DatabaseService
 */
describe('services DatabaseService', () => {
    beforeEach(() => {
        try {
            fs.unlinkSync(AppConfig.getDatabaseFilename())
        } catch (error) { }
    })

    it('get()', () => {
        let databaseService = new DatabaseService()
        let db = databaseService.get()
        expect(db).toBeDefined()
    })

    it('league table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('league')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('fixture table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('fixture')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('team table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('team')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('round table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('round')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('roundconfig table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('roundconfig')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('matchconfig table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('matchconfig')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('teamconfig table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('teamconfig')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('leagueconfig table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('leagueconfig')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('fixtureconfig table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('fixtureconfig')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

    it('info table exists', (done) => {
        let databaseService = new DatabaseService()
        databaseService.init().then(() => {
            let db = databaseService.get()
            return db.knex.schema.hasTable('info')
        }).then((res) => {
            expect(res).toBe(true)
            done()
        })
    })

})
