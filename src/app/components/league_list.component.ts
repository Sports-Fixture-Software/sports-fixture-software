import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../services/league.service';
import { League } from '../models/league';
import * as path from 'path';
import { DatabaseService } from '../services/database.service'
import { Collection }  from '../services/collection'
import * as Promise from 'bluebird'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    providers: [LeagueService] 
})

export class LeagueListComponent implements OnInit {
    private _leagueService : LeagueService
    leagues: League[]

    constructor(private leagueService: LeagueService) {
        this._leagueService = leagueService
    }

    ngOnInit() {
        return this._leagueService.getLeagues().then((l) => {
            this.leagues = l.toArray()
        })
    }
}
