import { databaseInjector } from '../bootstrap'
import { DatabaseService } from '../services/database.service'
import { Round } from './round'
import * as Promise from 'bluebird'

export class RoundConfig extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<RoundConfig> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'roundconfig' }

    get priority(): number { return this.get('priority') }
    set priority(value: number) { this.set('priority', value) }
    set key(value: string) { this.set('key', value) }
    get key(): string { return this.get('key') }
    set value(value: string) { this.set('value', value) }
    get value(): string { return this.get('value') }

    getRound(): Promise<Round> {
        return this.fetch({ withRelated: ['round'] }).then((res) => {
            return res.related('round') as Round
        })
    }
    setRound(value: Round) { this.set('round_id', value.id) }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected round() {
        return this.belongsTo(Round)
    }
}
