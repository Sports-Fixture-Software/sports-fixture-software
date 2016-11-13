/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription';
import { Team } from '../models/team'
import { TeamForm } from '../models/team.form'
import { League } from '../models/league'
import { LeagueService } from '../services/league.service'
import { TeamService } from '../services/team.service'
import { Collection } from '../services/collection'
import * as Promise from 'bluebird'
import { Navbar } from './navbar.component';
import { TeamListItem } from './team_list_item.component';
import { PopoverContent } from 'ng2-popover';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ButtonPopover } from './button_popover.component'
import { ButtonHidden } from './button_hidden.component'
import { AppConfig } from '../util/app_config'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_list.template.html',
    providers: [LeagueService, TeamService]
})

export class TeamListComponent implements OnInit, OnDestroy {
    /**
     * ## API
     * - `changeref` (provided by the injector)
     *    Angular2's change detector auto-detects Events, XHR, & Timers. For
     *    `bookshelf` data, we have call the change detector when data changes
     */
    constructor(private _leagueService: LeagueService,
        private _teamService: TeamService,
        private _changeref: ChangeDetectorRef,
        private _router: Router,
        private route: ActivatedRoute) {
    }
    @ViewChild('createTeamPopover') createTeamPopover: PopoverContent
    @ViewChild('createTeamButton') createTeamButton: ButtonPopover
    @ViewChild('addButtonDiv') addButtonDiv: ElementRef
    @ViewChild('teamListDiv') teamListDiv: ElementRef
    @ViewChild('newTeamText') newTeamText: ElementRef
    @ViewChild('addTeamButton') addTeamButton: ElementRef
    teamForm: FormGroup

    get teams(): Team[] { return this._teams }
    set teams(value: Team[]) { this._teams = value }
    get league(): League { return this._league }
    set league(value: League) { this._league = value }

    ngOnInit() {
        this.routeSubscription = this.route.parent.parent.params.subscribe(params => {
            let id = +params['id'];
            this._leagueService.getLeagueAndTeams(id).then((l) => {
                this.league = l
                this.teams = l.teamsPreLoaded.toArray()
                this._changeref.detectChanges()
            })
            this.teamForm = new FormGroup({
                name: new FormControl('', [<any>Validators.required]),
                team: new FormControl()
            })
        })
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    prepareForm(team?: Team) {
        if (team) {
            // Share the popover between two buttons (add and edit buttons)
            // ng2-popover supports this, but the positioning gets confused
            // when the buttons are in separate static containers - which is
            // the case here (col-xs-?? is a static container). Work around
            // this limitation by changing the popover's parent. 
            this.teamListDiv.nativeElement.appendChild(this.createTeamPopover.popoverDiv.nativeElement.parentElement)
            this.teamButtonText = TeamListComponent.EDIT_TEAM

            this.teamForm.patchValue({
                name: team.name,
                team: team
            })
        } else {
            this.addButtonDiv.nativeElement.appendChild(this.createTeamPopover.popoverDiv.nativeElement.parentElement)
            this.teamButtonText = TeamListComponent.CREATE_TEAM

            this.teamForm.patchValue({
                name: null,
                team: null
            })

            this.newTeamText.nativeElement.focus()
        }
        this._changeref.detectChanges()
    }

    createTeam(form: TeamForm) {
        let team = form.team
        if (!team) {
            team = new Team()
        }
        team.name = form.name
        team.setLeague(this.league)
        this._teamService.addTeam(team).then((t) => {
            this.createTeamPopover.hide()
            return this._teamService.getTeams(this.league)
        }).then((t) => {
            this.teams = t.toArray()
            this.addTeamButton.nativeElement.focus()
            this._changeref.detectChanges()
        }).catch((err: Error) => {
            this.createTeamButton.showError('Error creating team',
                'A database error occurred when creating the team. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this._changeref.detectChanges()
        })
    }

    navigateToTeam(team: Team) {
        this._router.navigate([team.id], { relativeTo: this.route });
    }

    private static CREATE_TEAM: string = 'Create Team'
    private static EDIT_TEAM: string = 'Edit Team'
    private teamButtonText: string
    private _teams: Team[]
    private _league: League
    private routeSubscription: Subscription
}
