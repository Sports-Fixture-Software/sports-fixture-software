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
            withRelated: ['league', 'league.teams']
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
