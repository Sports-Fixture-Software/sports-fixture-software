import { TeamConfig } from '../models/team_config';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class TeamConfigService {

    addTeamConfig(config: TeamConfig): Promise<TeamConfig> {
        return config.save()
    }

}
