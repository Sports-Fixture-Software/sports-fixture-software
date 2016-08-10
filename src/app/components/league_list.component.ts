import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../services/league.service';
import { League } from '../models/league';
import * as path from 'path';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    providers: [LeagueService] 
})

export class LeagueListComponent implements OnInit {
    private _leagueService : LeagueService;
    leagues : any[]

    constructor(private leagueService: LeagueService) {
        this._leagueService = leagueService;
    }

    ngOnInit() {
        this._leagueService.getLeagues().then(l => this.leagues = l)
    }
}
