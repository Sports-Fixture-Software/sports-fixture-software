import { databaseInjector } from '../../app/services/database_injector'
import { DatabaseService } from '../../app/services/database.service'
import { LeagueService } from '../../app/services/league.service'
import { AppConfig } from '../../app/util/app_config'
import { League } from '../../app/models/league'
import * as fs from 'fs'

describe('services LeagueService', () => {
    beforeAll(() => {
        console.log('all')
        AppConfig.setDatabaseFilename('test-unit.database')
    })

    beforeEach((done) => {
        try {
            console.log('unlink')
            fs.unlinkSync('test-unit.database')
        } catch (error) { }
        //let databaseService = new DatabaseService()
        let databaseService = databaseInjector.get(DatabaseService)
        databaseService.init().then(() => {
            console.log('init')
            done()
        })
    })

    it('getLeagues() with no leagues', (done) => {
        let leagueService = new LeagueService()
        leagueService.getLeagues().then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('getLeagues() with 1 league', (done) => {
        let leagueService = new LeagueService()
        let league = new League('alpha')
        leagueService.addLeague(league).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(league.name)
            done()
        })
    })
})
