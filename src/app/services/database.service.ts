import { Injectable } from '@angular/core'
import * as bookshelf from 'bookshelf'  
import * as knex from 'knex'
import * as Promise from 'bluebird'
import * as moment from 'moment'

@Injectable()
export class DatabaseService {

    constructor() {
        this.Model = this.get().Model
    }

    Model : typeof bookshelf.Model;

    get(): bookshelf {
        if (this._db == null) {
            this._db = bookshelf(knex(this.DBConfig))   
        }
        return this._db
    }

    init(): Promise<any> {
        if (this._initCalled == false) {
            return this.get().knex.schema.createTableIfNotExists
                ('info', (table) => {
                table.integer('databaseVersion')
            }).then((res) => {
                return this.get().knex.select().from('info')
            }).then((res) => {
                if (!res || res.length < 1
                    || res[0].databaseVersion != this._databaseVersion) {
                    return this.cleanDatabase().then((res) => {
                        return this.initDatabase()
                    })
                }
                return res
            }).then((res) => {
                this._initCalled = true
                return res
            }).catch((err: Error) => {
                this._initError = new Error
                    (`Unable to open database "${this.dbFilename}"
                     (${err.message})`)
            })
        }
        else {
            return new Promise<any>((resolve, reject) => resolve(null))
        }
    }

    private cleanDatabase(): Promise<any> {
        return this.get().knex.select('name').from('sqlite_master')
            .where('type', 'table').andWhere('name', '<>', 'sqlite_sequence')
            .then((res) => {
                return Promise.each(res, ((row : any) => {
                    return this.get().knex.schema.dropTable(row.name)
                }))
            })
    }

    /**
     * If you make any changes to the database schema below, increment
     * `_databaseVersion` by one. This will delete all data in the database to
     * avoid errors from conflicting schemas.
     */
    private initDatabase(): Promise<any> {
        return this.get().knex.schema.createTableIfNotExists('league',
            (table) => {
                table.increments('id')
                table.string('name')
                table.boolean('active').notNullable().defaultTo(true)
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('fixture',
                    (table) => {
                        table.increments('id')
                        table.boolean('active').notNullable().defaultTo(true)
                        table.string('name').notNullable()
                        table.string('description')
                        table.date('startDate')
                        table.date('endDate')
                        table.date('createdOn')
                        table.string('createdBy')
                        table.date('generatedOn')
                        table.string('generatedBy')
                        table.integer('league_id').notNullable().references
                            ('id').inTable('league')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('team',
                    (table) => {
                        table.increments('id')
                        table.string('name').notNullable()
                        table.integer('league_id').notNullable().references
                            ('id').inTable('league')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('round',
                    (table) => {
                        table.increments('id')
                        table.integer('number').notNullable()
                        table.string('name')
                        table.date('startDate')
                        table.integer('fixture_id').notNullable().references
                            ('id').inTable('fixture')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('roundconfig',
                    (table) => {
                        table.increments('id')
                        table.integer('priority')
                        table.string('key').notNullable()
                        table.string('value')
                        table.integer('round_id').notNullable().references
                            ('id').inTable('round')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('matchconfig',
                    (table) => {
                        table.increments('id')
                        table.integer('priority')
                        table.integer('homeTeam_id').notNullable().references
                            ('id').inTable('team')
                        table.integer('awayTeam_id').references
                            ('id').inTable('team')
                        table.integer('round_id').notNullable().references
                            ('id').inTable('round')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('match',
                    (table) => {
                        table.increments('id')
                        table.integer('homeTeam_id').notNullable().references
                            ('id').inTable('team')
                        table.integer('awayTeam_id').references
                            ('id').inTable('team')
                        table.integer('round_id').notNullable().references
                            ('id').inTable('round')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('teamconfig',
                    (table) => {
                        table.increments('id')
                        table.integer('priority')
                        table.integer('homeGamesMin')
                        table.integer('homeGamesMax')
                        table.integer('awayGamesMin')
                        table.integer('awayGamesMax')
                        table.integer('team_id').notNullable().references
                            ('id').inTable('team')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('info',
                    (table) => {
                        table.integer('databaseVersion')
                })
            }).then((res) => {
                return this.get().knex('info').insert
                    ({databaseVersion: this._databaseVersion})
            }).then((res) => {
                // for testing only. Remove from production version
                return this.seedDatabase()
            })
    }

    /**
     * Populate the database with data useful for testing.
     * Remove from production verison
     */
    private seedDatabase(): Promise<any> {
        let leagues = [
            { name: 'SANFL (10 teams)' },
            { name: 'South Australian National Footbal League (SANFL) - a really long name' },
            { name: 'U18 (9 teams)' }
        ]
        let fixtures = [
            {
                name: 'Fixture 2016', description: 'Fixture with early Easter',
                startDate: moment('2016-03-24').valueOf(), endDate: moment('2016-08-27').valueOf(), league_id: 1,
                createdOn: moment('2016-08-30').valueOf(), createdBy: 'Tom'
            },
            {
                name: 'Fixture 2017', description: 'Fixture with late Easter',
                startDate: moment('2017-04-13').valueOf(), endDate: moment('2016-08-27').valueOf(), league_id: 1,
                createdOn: moment('2016-08-30').valueOf(), createdBy: 'Tom'
            },
            {
                name: 'Fixture with a really long name to test the display and to see how wrapping is handled', description: 'Fixture description with a really long name to test the display and to see how wrapping is handled',
                startDate: moment('2017-04-13').valueOf(), endDate: moment('2016-08-27').valueOf(), league_id: 1,
                createdOn: moment('2016-08-30').valueOf(), createdBy: 'A person with a really really long name, super long'
            },
            {
                name: 'U18 Fixture 2016', description: 'Fixture with early Easter',
                startDate: moment('2016-03-24').valueOf(), endDate: moment('2016-08-27').valueOf(), league_id: 3
            },
            {
                name: 'U18 Fixture 2017', description: 'Fixture with late Easter',
                startDate: moment('2017-04-13').valueOf(), endDate: moment('2016-08-27').valueOf(), league_id: 3
            },
        ]
        let teams = [
            { name: 'Adelaide', league_id: 1},
            { name: 'Central', league_id: 1},
            { name: 'Glenelg', league_id: 1},
            { name: 'North', league_id: 1},
            { name: 'Norwood', league_id: 1},
            { name: 'Port', league_id: 1},
            { name: 'South', league_id: 1},
            { name: 'Sturt', league_id: 1},
            { name: 'West', league_id: 1},
            { name: 'Woodville-West Torrens Football Club - a really long name, really really long name', league_id: 1 },
            { name: 'Adelaide U18', league_id: 3},
            { name: 'Central U18', league_id: 3},
            { name: 'Glenelg U18', league_id: 3},
            { name: 'North U18', league_id: 3},
            { name: 'Norwood U18', league_id: 3},
            { name: 'Port U18', league_id: 3},
            { name: 'South U18', league_id: 3},
            { name: 'Sturt U18', league_id: 3},
            { name: 'West U18', league_id: 3},
        ]
        let teamConfigs = [
            { homeGamesMin: 0, homeGamesMax: 0, team_id: 1 }
        ]
        return Promise.each(leagues, (val) => {
            return this.get().knex('league').insert(val)
        }).then((res) => {
            return Promise.each(fixtures, (val) => {
                return this.get().knex('fixture').insert(val)
            })
        }).then((res) => {
            return Promise.each(teams, (val) => {
                return this.get().knex('team').insert(val)
            })
        }).then((res) => {
            return Promise.each(teamConfigs, (val) => {
                return this.get().knex('teamconfig').insert(val)
            })
        })
    }

    getInitError(): Error {
        return this._initError
    }

    private dbFilename: string = 'sanfl_fixture_software.database'
    private DBConfig = {  
        client: 'sqlite3',
        connection: {
            filename: this.dbFilename
        },
        useNullAsDefault: true
    }
    
    private _databaseVersion: number = 8
    private _initError: Error
    private _initCalled: boolean = false
    private _db : bookshelf = null
}
