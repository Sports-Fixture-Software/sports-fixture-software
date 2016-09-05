import { Round } from '../models/round';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class RoundService {

    /**
     * adds a round if the round `number` doesn't exist
     * updates exist round if the round `number` does exist
     *
     * Returns the add or updated `Round`
     */
    addUpdateRound(round: Round): Promise<Round> {
        return new Round().where('number', round.number).fetch()
            .then((res: Round) => {
                if (res) {
                    round.id = res.id
                }
                return round.save()
            })
    }

    addRound(round: Round): Promise<Round> {
        return round.save()
    }

}
