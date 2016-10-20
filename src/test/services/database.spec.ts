import { DatabaseService } from '../../app/services/database.service'
import { AppConfig } from '../../app/util/app_config'
import * as fs from 'fs'

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
