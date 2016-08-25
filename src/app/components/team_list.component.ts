import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import { Team } from '../models/team'
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

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_list.template.html',
    providers: [LeagueService, TeamService],
    directives: [TeamListItem, ButtonPopover, POPOVER_DIRECTIVES, MODAL_DIRECTIVES]
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
    @ViewChild('newTeamButton') newTeamButton: ButtonPopover
    newTeamText: String

    get teams(): Team[] { return this._teams }
    set teams(value: Team[]) { this._teams = value }
    get league(): League { return this._league }
    set league(value: League) { this._league = value }

    ngOnInit() {
        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._leagueService.getLeague(id).then((l) => {
                    this.league = l
                    return l.getTeams()
                }).then((t) => {
                    this.teams = t.toArray()
                    this._changeref.detectChanges()
                })
            })
    }

    submitAddTeam(teamName: string) {
        let team: Team = new Team(teamName)
        team.setLeague(this.league)
        this._teamService.addTeam(team).then((t) => {
            this.teams.push(team)
            this.createTeamPopover.hide()
            this._changeref.detectChanges()
        }).catch((err : Error) => {
            this.newTeamButton.showError('Error creating team', err.message)
            this._changeref.detectChanges()
        })
    }

    private _teams: Team[]
    private _league: League
}
