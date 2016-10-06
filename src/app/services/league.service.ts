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
        return new League().where('active', true).fetchAll()
    }

    getLeague(id: number): Promise<League> {
        return new League().where('id', id).fetch()
    }

    /**
     * get league and the associated fixtures.
     */
    getLeagueAndFixtures(id: number): Promise<League> {
        return new League().where('id', id).fetch({
            withRelated: [
                {
                    'fixtures' : (qb) => {
                        return qb.where('active', true)
                    }
                }]
        })
    }

    /**
     * get league and the associated teams.
     */
    getLeagueAndTeams(id: number): Promise<League> {
        return new League().where('id', id).fetch({
            withRelated: ['teams']
        })
    }

    /**
     * get league and the associated league config.
     */
    getLeagueAndConfig(id: number): Promise<League> {
        return new League().where('id', id).fetch({
            withRelated: ['leagueConfig']
        })
    }

    public addLeague(league: League): Promise<League> {
        return league.save()
    }

    public updateLeague(league: League): Promise<League> {
        return league.save()
    }

    /**
     * returns the deleted league
     */
    deleteLeague(league: League): Promise<League> {
        league.set('active', false)
        return league.save()
    }

    getInitError(): Error {
        return this._db.getInitError()
    }

    private _db: DatabaseService
}
