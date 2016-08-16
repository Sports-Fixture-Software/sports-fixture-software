import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { League } from '../models/league';
import { DatabaseService } from '../services/database.service'
import { LeagueService } from '../services/league.service';
import { Collection }  from '../services/collection'
import * as Promise from 'bluebird'
import { Navbar } from './navbar.component';
import { LeagueListItem } from './league_list_item.component';
import { POPOVER_DIRECTIVES } from 'ng2-popover';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    properties : ['leagues'],
    providers: [LeagueService], 
    directives: [Navbar, LeagueListItem, POPOVER_DIRECTIVES]
})

export class LeagueListComponent implements OnInit {
    /**
     * ## API
     * - `changeref` (provided by the injector)
     *    Angular2's change detector auto-detects Events, XHR, & Timers. For
     *    `bookshelf` data, we have call the change detector when data changes
     */
    constructor(private leagueService: LeagueService,
        private changeref: ChangeDetectorRef) {
        this._leagueService = leagueService
        this._changeref = changeref
    }
    newLeagueText : String

    get leagues(): League[] { return this._leagues }
    set leagues(value: League[]) { this._leagues = value }

    ngOnInit() {
        this._leagueService.getLeagues().then((l) => {
            this.leagues = l.toArray()
            this._changeref.detectChanges()
        })
    }

    submitAddLeague(leagueName: String) {
        this._leagueService
            .addLeague(new League(leagueName))
            .then((l) => {
                this.leagues.push(l)
                this._changeref.detectChanges()
            })
    }

    private _leagueService: LeagueService
    private _changeref: ChangeDetectorRef
    private _leagues : League[]
}
