import { Component, OnInit } from '@angular/core';
import { LeagueService } from '../services/league.service';
import { League } from '../models/league';
import { Navbar } from './navbar.component';
import { LeagueListItem } from './league_list_item.component';
import { POPOVER_DIRECTIVES } from 'ng2-popover';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    providers: [LeagueService],
    directives: [Navbar, LeagueListItem, POPOVER_DIRECTIVES]
})

export class LeagueListComponent implements OnInit {
    private _leagueService : LeagueService
    leagues : any[]
    newLeagueText : String

    constructor(private leagueService: LeagueService) {
        this._leagueService = leagueService
    }

    ngOnInit() {
        this._leagueService
            .getLeagues()
            .then(l => this.leagues = l)
            .catch(error => {
                console.log(error);
            });
    }

    submitAddLeague(leagueName: String) {
        this._leagueService
            .addLeague(leagueName)
            .then(l => this.leagues.push(l))
    }
}
