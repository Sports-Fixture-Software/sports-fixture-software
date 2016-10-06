import { FixtureConfig } from '../models/fixture_config';
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class FixtureConfigService {

    addFixtureConfig(config: FixtureConfig): Promise<FixtureConfig> {
        return config.save()
    }

}
