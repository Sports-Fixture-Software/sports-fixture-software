import { RoundConfig } from '../models/round_config';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class RoundConfigService {

    /**
     * adds the config to the database
     */
    addConfig(config: RoundConfig): Promise<RoundConfig> {
        return config.save()
    }
}
