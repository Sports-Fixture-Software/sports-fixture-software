import { Injectable } from '@angular/core'
import * as bookshelf from 'bookshelf'  
import * as knex from 'knex'
import * as Promise from 'bluebird'

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

    private initDatabase(): Promise<any> {
        return this.get().knex.schema.createTableIfNotExists('league',
            (table) => {
                table.increments('id')
                table.string('name')
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('fixture',
                    (table) => {
                        table.increments('id')
                        table.string('name').notNullable()
                        table.string('description')
                        table.date('startDate')
                        table.date('endDate')
                        table.date('createdOn')
                        table.string('createdBy')
                        table.date('generatedOn')
                        table.string('generatedBy')
                        table.integer('league_id').notNullable().references('id').inTable('league')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('team',
                    (table) => {
                        table.increments('id')
                        table.string('name').notNullable()
                        table.integer('league_id').notNullable().references('id').inTable('league')
                })
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('info',
                    (table) => {
                        table.integer('databaseVersion')
                })
            }).then((res) => {
                return this.get().knex('info').insert
                    ({databaseVersion: this._databaseVersion})
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
    
    private _databaseVersion: number = 1
    private _initError: Error
    private _initCalled: boolean = false
    private _db : bookshelf = null
}
