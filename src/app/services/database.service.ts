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
            return this.get().knex.schema.createTableIfNotExists('league', (table) => {
                table.increments('id')
                table.string('name')
            }).then((res) => {
                return this.get().knex.schema.createTableIfNotExists('fixture',
                    (table) => {
                        table.increments('id')
                        table.string('name')
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
    
    private _initError: Error
    private _initCalled: boolean = false
    private _db : bookshelf = null
}
