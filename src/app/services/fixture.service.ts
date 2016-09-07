import { League } from '../models/league';
import { Round } from '../models/round';
import { Fixture } from '../models/fixture';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class FixtureService {

    getFixtures(leagueId?: number): Promise<Collection<Fixture>> {
        if (leagueId) {
            return new Fixture().where('league_id', leagueId).fetchAll()
        } else {
            return new Fixture().fetchAll()
        }
    }

    getFixture(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch()
    }

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

    public addFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.save()
    }

    public updateFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.save()
    }

    /**
     * returns an empty Fixture
     */
    deleteFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.destroy()
    }
}
