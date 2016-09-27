import { DatabaseService } from '../../app/services/database.service'

describe('services DatabaseService', () => {
    it('get()', () => {
        let databaseService = new DatabaseService()
        let db = databaseService.get()
        expect(db).toBeDefined()
    })
    it('league table exists', (done) => {
        let databaseService = new DatabaseService()
        let db = databaseService.get()
        db.knex.schema.hasTable('league').then((res) => {
            expect(res).toBe(true)
            done()
        })
    })
})
