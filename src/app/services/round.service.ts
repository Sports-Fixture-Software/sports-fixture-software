import { Round } from '../models/round';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class RoundService {

    addRound(round: Round): Promise<Round> {
        return round.save()
    }

}
