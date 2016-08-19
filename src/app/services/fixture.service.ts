import { League } from '../models/league';
import { Fixture } from '../models/fixture';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class FixtureService {

    getFixtures(): Promise<Collection<Fixture>> {
        return new Fixture().fetchAll()
    }

    getFixture(id: number): Promise<Fixture> {
        return new Fixture().where('id', id).fetch()
    }

    public addFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.save()
    }

    /**
     * returns an empty League
     */
    deleteFixture(fixture: Fixture): Promise<Fixture> {
        return fixture.destroy()
    }
}
