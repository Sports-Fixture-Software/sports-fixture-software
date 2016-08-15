import { League } from '../models/league';
import * as sqlite from 'sqlite3'
import { databaseInjector } from '../bootstrap'
import { DatabaseService } from './database.service'
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class LeagueService {

    private _db : DatabaseService

    constructor() {
        this._db = databaseInjector.get(DatabaseService);
     }

    public getLeagues(): Promise<Collection<League>> {
        //return this._db.init().then(() => {
            return new League().fetchAll()
        //})
    }
}
