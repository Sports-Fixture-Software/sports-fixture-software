import { databaseInjector } from '../bootstrap'
import { DatabaseService } from '../services/database.service'
import { League } from './league'
import * as Promise from 'bluebird'

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
    getLeague(): Promise<League> {
        return this.fetch({ withRelated: ['league'] }).then((res) => {
            return res.related('league') as League
        })
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected league() {
        return this.belongsTo(League)
    }
}
