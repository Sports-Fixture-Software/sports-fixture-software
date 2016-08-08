import { Injectable } from '@angular/core';

import { League } from '../models/league'

@Injectable()
export class LeagueService {
    public getLeagues() : League[] {
        return [];
    }
}
