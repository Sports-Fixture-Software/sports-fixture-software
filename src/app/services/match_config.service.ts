import { MatchConfig } from '../models/match_config';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class MatchConfigService {

    addMatchConfig(config: MatchConfig): Promise<MatchConfig> {
        return config.save()
    }

}
