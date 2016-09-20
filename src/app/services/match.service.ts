import { Match } from '../models/match'
import { Round } from '../models/round'
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class MatchService {

    /**
     * Add a match to the database.
     *
     * Returns the added match.
     */
    addMatch(match: Match): Promise<Match> {
        return match.save()
    }

    /**
     * Delete all matches for the specified round.
     *
     * Returns an empty Match model.
     */
    deleteMatches(round: Round): Promise<Match> {
        return new Match().where('round_id', round.id).destroy()
    }
}
