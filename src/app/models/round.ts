import { databaseInjector } from '../bootstrap'
import { DatabaseService } from '../services/database.service'
import { Fixture } from './fixture'
import { RoundConfig } from './round_config'
import { Match } from './match'
import { MatchConfig } from './match_config'
import { Collection } from '../services/collection'
import * as Promise from 'bluebird'
import * as moment from 'moment'

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
    set startDate(value: moment.Moment) { this.set('startDate', value.valueOf()) }
    get startDate(): moment.Moment { return moment(this.get('startDate')) }

    setFixture(value: Fixture) { this.set('fixture_id', value.id) }

    get matchConfigsPreLoaded(): MatchConfig[] {
        let col = this.related('matchConfigs') as Collection<MatchConfig>
        return col.toArray()
    }

    /**
     * Returns the list of *loaded* matches related to this round. The matches
     * are loaded via eager loading, see `FixtureService`
     * `getRoundsAndMatches()`.
     * Returns an empty array, if matches haven't been loaded.
     */
    get matchesPreLoaded(): Match[] {
        let matches = this.related('matches') as Collection<Match>
        if (matches) {
            return matches.toArray()
        } else {
            return []
        }
    }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected fixture() {
        return this.belongsTo(Fixture)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected roundConfigs(): Collection<RoundConfig> {
        return this.hasMany(RoundConfig)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected matches(): Collection<Match> {
        return this.hasMany(Match)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected matchConfigs(): Collection<MatchConfig> {
        return this.hasMany(MatchConfig)
    }
}
