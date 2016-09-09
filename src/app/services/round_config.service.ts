import { RoundConfig } from '../models/round_config';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class RoundConfigService {

    /**
     * adds the config, but won't add if the key/value already exists.
     *
     * Returns the added config, or the existing `RoundConfig` that has the
     * same key/value pair.
     */
    addConfig(config: RoundConfig): Promise<RoundConfig> {
        return config.where({ key: config.key, value: config.value }).fetch().then((res) => {
            if (res) {
                return res
            } else {
                return config.save()
            }
        })
    }
}
