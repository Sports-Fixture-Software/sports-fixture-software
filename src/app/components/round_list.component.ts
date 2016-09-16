import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Validators } from '@angular/common'
import { FixtureService } from '../services/fixture.service'
import { RoundService } from '../services/round.service'
import { MatchConfigService } from '../services/match_config.service'
import { Collection } from '../services/collection'
import { Fixture } from '../models/fixture'
import { League } from '../models/league'
import { Team } from '../models/team'
import { Round } from '../models/round'
import { MatchConfig } from '../models/match_config'
import { RoundForm } from '../models/round.form'
import { ButtonPopover } from './button_popover.component'
import { ButtonHidden } from './button_hidden.component'
import { DateTime } from '../util/date_time'
import { DaysOfWeek } from '../util/days_of_week'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover';
import * as moment from 'moment'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService, RoundService, MatchConfigService],
    directives: [ButtonPopover, ButtonHidden, REACTIVE_FORM_DIRECTIVES, POPOVER_DIRECTIVES],
    templateUrl: 'round_list.template.html'
})

export class RoundListComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _roundService: RoundService,
        private _matchConfigService: MatchConfigService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }

    @ViewChild('createMatchupButton') createMatchupButton: ButtonPopover
    @ViewChild('createMatchupPopover') createMatchupPopover: PopoverContent
    matchupForm: FormGroup
    error: Error

    ngOnInit() {
        this.matchupForm = new FormGroup({
            round: new FormControl(),
            homeTeam: new FormControl('', [<any>Validators.required]),
            awayTeam: new FormControl('', [<any>Validators.required])
        }, {}, this.differentTeamsSelectedValidator)

        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._fixtureService.getFixture(id).then((f) => {
                    this.fixture = f
                    return this._fixtureService.getRoundsAndConfig(f)
                }).then((rounds: Collection<Round>) => {
                    this.rounds = rounds.toArray()
                    this.fillInRounds()
                }).then(() => {
                    return this.fixture.getLeague()
                }).then((league: League) => {
                    return league.getTeams()
                }).then((teams: Collection<Team>) => {
                    this.homeTeamsAll = teams.toArray()
                    this.awayTeamsAll = teams.toArray()
                    this.awayTeamsAll.push(new Team('Bye'))
                    this.homeTeams = this.homeTeamsAll.slice(0) //copy
                    this.awayTeams = this.homeTeamsAll.slice(0) //copy
                    this._changeref.detectChanges()
                }).catch((err: Error) => {
                    let detail = err ? err.message : ''
                    this.error = new Error(`Error loading rounds: ${detail}`)
                    this._changeref.detectChanges()
                })
            })
    }

    prepareForm(round: Round) {
        let fc = this.matchupForm.controls['round'] as FormControl
        fc.updateValue(round)
        this.removeTeamsAsAlreadyReserved(round)
    }

    createMatchup(form: RoundForm) {
        this._roundService.addUpdateRound(form.round).then(() => {
            let config = new MatchConfig()
            config.setRound(form.round)
            config.setHomeTeam(form.homeTeam)
            config.setAwayTeam(form.awayTeam)
            let fc = this.matchupForm.controls['homeTeam'] as FormControl
            fc.updateValue(null)
            fc = this.matchupForm.controls['awayTeam'] as FormControl
            fc.updateValue(null)
            return this._matchConfigService.addMatchConfig(config)
        }).then(() => {
            this.createMatchupPopover.hide()
            this._changeref.detectChanges()
        }).catch((err: Error) => {
            this.createMatchupButton.showError('Error creating match-up', err.message)
        })
    }

    /**
     * Fills in the "gaps" in rounds. The database may already have some rounds
     * because of entered constraints - constraints need a parent `Round`. Fill
     * in any gaps with new `Round`s.
     */
    private fillInRounds() {
        let runningDate = moment(this.fixture.startDate)
        if (runningDate.day() == DaysOfWeek.Sunday) {
            runningDate.subtract(1, 'day')
        } else if (runningDate.day() < DaysOfWeek.Saturday) {
            runningDate.add(DaysOfWeek.Saturday - runningDate.day(), 'day')
        }
        for (let i = 1; i <= DateTime.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate); i++) {
            let index = this.binarySearch(this.rounds, i, (a: number, b: Round) => {
                return a - b.number
            })
            if (i > 1) {
                runningDate.add(1, 'week')
            }
            if (index < 0) {
                let round = new Round(i)
                if (i == 1) {
                    round.startDate = this.fixture.startDate
                } else {
                    round.startDate = runningDate.toDate()
                }
                round.setFixture(this.fixture)
                this.rounds.splice(~index, 0, round)
            }
        }
    }

    /**
     * binary search `theArray`, looking for `element`.
     *
     * `theArray` must be sorted. `compare` is a binary compare function that
     * returns < 0 if arg1 < arg2, returns 0 if arg1 == arg2, and returns > 0
     * if arg1 > arg2.
     *
     * Returns the index if found. Returns < 0 if not found. If not found,
     * returns the bitwise compliment of the index to insert the `element` if
     * maintaining a sorted array.
     */
    private binarySearch(theArray: any[], element: any, compare: Function): number {
        let m = 0;
        let n = theArray.length - 1;
        while (m <= n) {
            let k = (n + m) >> 1;
            let cmp = compare(element, theArray[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if (cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return ~m
    }

    /**
     * Remove teams from the drop-down home and away teams list.
     *
     * If the user has reserved a match-up, remove from the list so the user
     * can't reserve the same team again on the same round.
     */
    private removeTeamsAsAlreadyReserved(round: Round) {
        round.getMatchConfigs().then((configs) => {
            this.homeTeams = this.homeTeamsAll.slice(0) //copy
            this.awayTeams = this.awayTeamsAll.slice(0) //copy
            // config null if .getMatchConfigs() fails. If fails, show all teams
            if (configs) {
                configs.each((config) => {
                    let count = 0
                    for (let i = this.homeTeams.length - 1; i >= 0; i--) {
                        if (this.homeTeams[i].id == config.homeTeam_id ||
                            this.homeTeams[i].id == config.awayTeam_id) {
                            this.homeTeams.splice(i, 1)
                            count++
                            if (count >= 2) {
                                break
                            }
                        }
                    }
                    count = 0
                    for (let i = this.awayTeams.length - 1; i >= 0; i--) {
                        // don't delete the bye from the away teams
                        if ((config.awayTeam_id && // not the bye
                            this.awayTeams[i].id == config.awayTeam_id) ||
                            this.awayTeams[i].id == config.homeTeam_id) {
                            this.awayTeams.splice(i, 1)
                            count++
                            if (count >= 2) {
                                break
                            }
                        }
                    }
                })
            }
            this._changeref.detectChanges()
            let fc = this.matchupForm.controls['homeTeam'] as FormControl
            fc.updateValue(null)
            fc = this.matchupForm.controls['awayTeam'] as FormControl
            fc.updateValue(null)
        })
    }

    /**
     * Validator to ensure different teams are selected. Can't reserve a
     * match-up of teamX vs teamX
     */
    private differentTeamsSelectedValidator = ({value}: FormGroup): { [key: string]: any } => {
        return value.homeTeam == value.awayTeam ? { equal: true } : null
    }

    private initComplete: boolean = false
    private rounds: Round[] = []
    private homeTeams: Team[]
    private homeTeamsAll: Team[]
    private awayTeams: Team[]
    private awayTeamsAll: Team[]
    private fixture: Fixture
}
