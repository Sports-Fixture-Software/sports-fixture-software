import { League } from '../models/league';
import * as sqlite from 'sqlite3'
import { databaseInjector } from '../bootstrap'
import { DatabaseService } from './database.service'
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class LeagueService {

    constructor() {
        this._db = databaseInjector.get(DatabaseService);
     }

    getLeagues(): Promise<Collection<League>> {
        return this._db.init().then(() => {
            return new League().fetchAll()
        })
    }

    getLeague(id: number): Promise<League> {
        return this._db.init().then(() => {
            return new League().where('id', id).fetch()
        })
    }

    public addLeague(league: League): Promise<League> {
        return this._db.init().then(() => {
            return league.save()
        })
    }

    private _db: DatabaseService
}
