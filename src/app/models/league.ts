/**
 * League
 */
import { databaseInjector } from '../bootstrap'
import { DatabaseService } from '../services/database.service'
import * as bookshelf from 'bookshelf'

export class League extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<League> {

    constructor(params ?: any) {
         super(params)
    }

    get tableName() { return 'league'; }
    public get name(): string { return this.get('name') }
    public set name(value: string) { this.set('name', value) }
}
