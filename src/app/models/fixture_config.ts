import { databaseInjector } from '../bootstrap'
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
