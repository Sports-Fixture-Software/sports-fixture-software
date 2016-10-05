import { LeagueConfig } from '../models/league_config';
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class LeagueConfigService {

    addLeagueConfig(config: LeagueConfig): Promise<LeagueConfig> {
        return config.save()
    }

}
