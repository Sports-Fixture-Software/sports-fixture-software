import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { League } from '../models/league';
import { LeaguePresenter } from '../presenters/league.presenter';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'fixture_list.template.html'
})

export class FixtureListComponent implements OnInit {
    constructor(private _leaguePresenter: LeaguePresenter) {
    }

    activeLeage: League;

    ngOnInit() {
        this.activeLeage = this._leaguePresenter.activeLeague
    }
}
