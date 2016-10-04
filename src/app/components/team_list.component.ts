import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Validators } from '@angular/common'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Team } from '../models/team'
import { TeamForm } from '../models/team.form'
import { League } from '../models/league'
import { LeagueService } from '../services/league.service'
import { TeamService } from '../services/team.service'
import { Collection }  from '../services/collection'
import * as Promise from 'bluebird'
import { Navbar } from './navbar.component';
import { TeamListItem } from './team_list_item.component';
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { ButtonPopover } from './button_popover.component'
import { ButtonHidden } from './button_hidden.component'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_list.template.html',
    providers: [LeagueService, TeamService],
    directives: [TeamListItem, ButtonPopover, ButtonHidden, POPOVER_DIRECTIVES, MODAL_DIRECTIVES, REACTIVE_FORM_DIRECTIVES]
})

export class TeamListComponent implements OnInit {
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
        private _route: ActivatedRoute) {
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
        this._router.routerState.parent(this._router.routerState.parent(this._route)).params.forEach(params => {
                let id = +params['id'];
                this._leagueService.getLeague(id).then((l) => {
                    this.league = l
                    return l.getTeams()
                }).then((t) => {
                    this.teams = t.toArray()
                    this._changeref.detectChanges()
                })
                this.teamForm = new FormGroup({
                    name: new FormControl('', [<any>Validators.required]),
                    team: new FormControl()
                })
            })
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
            let fc = this.teamForm.controls['team'] as FormControl
            fc.updateValue(team)
            fc = this.teamForm.controls['name'] as FormControl
            fc.updateValue(team.name)
        } else {
            this.addButtonDiv.nativeElement.appendChild(this.createTeamPopover.popoverDiv.nativeElement.parentElement)
            this.teamButtonText = TeamListComponent.CREATE_TEAM
            let fc = this.teamForm.controls['team'] as FormControl
            fc.updateValue(null)
            fc = this.teamForm.controls['name'] as FormControl
            fc.updateValue(null)
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
            return this.league.getTeams()
        }).then((t) => {
            this.teams = t.toArray()
            this.addTeamButton.nativeElement.focus()
            this._changeref.detectChanges()
        }).catch((err : Error) => {
            this.createTeamButton.showError('Error creating team', err.message)
            this._changeref.detectChanges()
        })
    }

    navigateToTeam(team: Team) {
        this._router.navigate([team.id], { relativeTo: this._route });
    }

    private static CREATE_TEAM: string = 'Create Team'
    private static EDIT_TEAM: string = 'Edit Team'
    private teamButtonText: string
    private _teams: Team[]
    private _league: League
}
