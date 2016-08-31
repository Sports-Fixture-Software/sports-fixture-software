import { databaseInjector } from '../bootstrap'
import { DatabaseService } from '../services/database.service'
import { Fixture } from './fixture'
import * as moment from 'moment'
import * as Promise from 'bluebird'

export class Round extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<Round> {

    constructor(params?: number | any) {
        if (typeof params === 'number') {
            super()
            this.number = params
        } else {
            super(params)
        }
    }

    get tableName() { return 'round' }

    get number(): number { return this.get('number') }
    set number(value: number) { this.set('number', value) }
    set name(value: string) { this.set('name', value) }
    get name(): string { return this.get('name') }
    set startDate(value: moment.Moment) { this.set('startDate', value) }
    get startDate(): moment.Moment { return this.get('startDate') }

    getFixture(): Promise<Fixture> {
        return this.fetch({ withRelated: ['fixture'] }).then((res) => {
            return res.related('fixture') as Fixture
        })
    }
    setFixture(value: Fixture) { this.set('fixture_id', value.id) }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected fixture() {
        return this.belongsTo(Fixture)
    }
}
