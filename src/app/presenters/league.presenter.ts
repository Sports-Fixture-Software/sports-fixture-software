import { Injectable } from '@angular/core'
import { League } from '../models/league';

@Injectable()
export class LeaguePresenter {
    get activeLeague(): League { return this._activeLeague }
    set activeLeague(value: League) { this._activeLeague = value }
    private _activeLeague: League;
}
