import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Params, ROUTER_DIRECTIVES } from '@angular/router';
import { LeagueService } from '../services/league.service'
import { League } from '../models/league'
import { POPOVER_DIRECTIVES } from 'ng2-popover';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [LeagueService],
    templateUrl: 'league_details.template.html',
    directives: [ROUTER_DIRECTIVES]
})

export class LeagueDetailsComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _leagueService: LeagueService, private _route: ActivatedRoute) {
    }

    get league(): League { return this._league }
    set league(value: League) { this._league = value }

    ngOnInit() {
        this._route.params.forEach((params: Params) => {
            let id = +params['id'];
            this._leagueService.getLeague(id).then((l) => {
                this.league = l
                this._changeref.detectChanges()
            })
        })
    }

    private _league: League
}
