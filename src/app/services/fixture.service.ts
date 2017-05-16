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
import { Round } from '../models/round';
import { Fixture } from '../models/fixture';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class FixtureService {

    getFixtures(league?: League): Promise<Collection<Fixture>> {
        if (league) {
            return league.fetch({
                withRelated: [
                    {
                        'fixtures' : (qb) => {
                            return qb.where('active', true)
                        }
                    }]
            }).then((res) => {
                return res.related('fixtures') as Collection<Fixture>
            })
        } else {
            return new Fixture().where('active', true).fetchAll()
        }
    }

    getFixture(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch()
    }

    /**
     * get fixture, and the associated league
     */
    getFixtureAndLeague(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch({
            withRelated: ['league']
        })
    }

    /**
     * get fixture, and the associated teams
     */
    getFixtureAndTeams(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch({
            withRelated: ['league', {
                'league.teams': (qb) => {
                    return qb.where('active', true)
                }
            }]
        })
    }

    /**
     * get fixture, and the associated fixture config, and the associated
     * league
     */
    getFixtureAndLeagueAndConfig(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch({
            withRelated: ['fixtureConfig', 'league']
        })
    }

    /**
     * get fixture, and associated fixture config, league, league config, teams,
     * team config, rounds and round config.
     */
    getFixtureAndAllRelated(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch({
            withRelated: [
                'fixtureConfig',
                'league',
                'league.leagueConfig',
                {
                    'league.teams': (qb) => {
                        return qb.where('active', true)
                    }
                },
                'league.teams.teamConfig',
                {
                    'rounds': (qb) => {
                        return qb.orderBy('number')
                    }
                },
                'rounds.matchConfigs'
            ]
        })
    }

    /**
     * get all rounds for the fixture, sorted by round number.
     */
    getRounds(fixture: Fixture): Promise<Collection<Round>> {
        return fixture.fetch({
            withRelated: [
                {
                    'rounds': (qb) => {
                        return qb.orderBy('number')
                    }
                }]
        }).then((res) => {
            return res.related('rounds') as Collection<Round>
        })
    }

    /**
     * get all rounds for the fixture, and the associated match configs, and
     * the associated team names.
     */
    getRoundsAndConfig(fixture: Fixture): Promise<Collection<Round>> {
        return fixture.fetch({
            withRelated: [
                {
                    'rounds': (qb) => {
                        return qb.orderBy('number')
                    }
                },
                'rounds.matchConfigs',
                'rounds.matchConfigs.homeTeam',
                'rounds.matchConfigs.awayTeam']
        }).then((res) => {
            return res.related('rounds') as Collection<Round>
        })
    }

    /**
     * get all rounds for the fixture, and the associated matches, and the
     * associated team names. The associated matches and associated team names
     * can be obtained via the `PreLoaded` model methods.
     */
    getRoundsAndMatches(fixture: Fixture): Promise<Collection<Round>> {
        return fixture.fetch({
            withRelated: [
                {
                    'rounds': (qb) => {
                        return qb.orderBy('number')
                    }
                },
                'rounds.matches',
                'rounds.matches.homeTeam',
                'rounds.matches.awayTeam']
        }).then((res) => {
            return res.related('rounds') as Collection<Round>
        })
    }

    public addFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.save()
    }

    public updateFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.save()
    }

    /**
     * returns the deleted ixture
     */
    deleteFixture(fixture: Fixture): Promise<Fixture> {
        fixture.set('active', false)
        return fixture.save()
    }
}
