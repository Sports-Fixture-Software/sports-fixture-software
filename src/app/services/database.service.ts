import { Injectable } from '@angular/core'
import * as bookshelf from 'bookshelf'  
import * as knex from 'knex'
import * as Promise from 'bluebird'

@Injectable()
export class DatabaseService {

    private static count: number = 0
    
    constructor() {
        console.log('DatabaseService: ' + DatabaseService.count)
        this.Model = this.get().Model
        DatabaseService.count++
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
                this._initCalled = true
                return res
            }).catch((err: Error) => {
                return new Error('Unable create table "league": ' + err.message)
            })
        }
        else {
            return new Promise<any>((resolve, reject) => resolve(null))
        }
    }

    private dbFilename: string = 'sanfl_fixture_software.database'
    private DBConfig = {  
        client: 'sqlite3',
        connection: {
            filename: this.dbFilename
        }
    }
    
    private _initCalled : boolean = false
    private _db : bookshelf = null
}
