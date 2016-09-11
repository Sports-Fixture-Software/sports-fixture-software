import { League } from '../models/league';
import * as sqlite from 'sqlite3'
import { databaseInjector } from './database.injector'
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
        return new League().fetchAll()
    }

    getLeague(id: number): Promise<League> {
        return new League().where('id', id).fetch()
    }

    public addLeague(league: League): Promise<League> {
        return league.save()
    }

    /**
     * returns an empty League
     */
    deleteLeague(league: League): Promise<League> {
        return league.destroy()
    }

    getInitError(): Error {
        return this._db.getInitError()
    }

    private _db: DatabaseService
}
