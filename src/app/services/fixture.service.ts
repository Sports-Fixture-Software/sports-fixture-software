import { League } from '../models/league';
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
