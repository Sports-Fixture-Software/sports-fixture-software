import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { League } from '../models/league';
import { LeagueService } from '../services/league.service';
import { Collection }  from '../services/collection'
import * as Promise from 'bluebird'
import { Navbar } from './navbar.component';
import { AppConfig } from '../util/app_config'
import { LeagueListItem } from './league_list_item.component';
import { POPOVER_DIRECTIVES } from 'ng2-popover';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ButtonPopover } from './button_popover.component'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    properties : ['leagues'],
    providers: [LeagueService], 
    directives: [Navbar, LeagueListItem, ButtonPopover, POPOVER_DIRECTIVES, MODAL_DIRECTIVES]
})

export class LeagueListComponent implements OnInit {
    /**
     * ## API
     * - `changeref` (provided by the injector)
     *    Angular2's change detector auto-detects Events, XHR, & Timers. For
     *    `bookshelf` data, we have call the change detector when data changes
     */
    constructor(private leagueService: LeagueService,
        private changeref: ChangeDetectorRef,
        private router: Router) {
        this._leagueService = leagueService
        this._changeref = changeref
    }

    @ViewChild('errorModal')
    @ViewChild('createLeagueButton') createLeagueButton: ButtonPopover
    errorModal : ModalComponent

    newLeagueText: String
    lastError: Error

    get leagues(): League[] { return this._leagues }
    set leagues(value: League[]) { this._leagues = value }

    ngOnInit() {
        this.lastError = this._leagueService.getInitError();
        if (this.lastError) {
            this.errorModal.open()
        } else {
            this._leagueService.getLeagues().then((l) => {
                this.leagues = l.toArray()
                this._changeref.detectChanges()
            }).catch((err: Error) => {
                this.lastError = new Error(`A error occurred loading the database "${AppConfig.getDatabaseFilename()}"" . ${AppConfig.DatabaseErrorGuidance}`)
                AppConfig.log(err)
                this.errorModal.open()
            })
        }
    }

    submitAddLeague(leagueName: String) {
        this._leagueService
            .addLeague(new League(leagueName))
            .then((l) => {
                this.leagues.push(l)
                this._changeref.detectChanges()
            }).catch((err: Error) => {
                this.createLeagueButton.showError('Error creating league',
                    'A database error occurred when creating the league. ' + AppConfig.DatabaseErrorGuidance)
                AppConfig.log(err)
                this.changeref.detectChanges()
            })
    }

    navigateToLeague(league: League) {
        this.router.navigate(['/league', league.id]);
    }

    errorModalOk() {
        this.errorModal.close()
    }

    private _leagueService: LeagueService
    private _changeref: ChangeDetectorRef
    private _leagues : League[]
}
