/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { League } from '../models/league';
import * as sqlite from 'sqlite3'
import { databaseInjector } from './database_injector'
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
            withRelated: [
                {
                    'teams' : (qb) => {
                        return qb.where('active', true)
                    }
                }]
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
