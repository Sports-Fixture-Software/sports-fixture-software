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
import { DaysOfWeek } from '../util/days_of_week'
import { Search } from '../util/search'
import { ButtonPopover } from './button_popover.component'
import { ButtonHidden } from './button_hidden.component'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover';
import * as moment from 'moment'
import * as twitterBootstrap from 'bootstrap'
declare var jQuery: JQueryStatic

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
            awayTeam: new FormControl('', [<any>Validators.required]),
            config: new FormControl()
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
                    let byeTeam = new Team('Bye')
                    byeTeam.id = null
                    this.awayTeamsAll.push(byeTeam)
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

    /**
     * Called after ngFor is complete.
     * 
     * If, in the future, Angular2 provides native support for
     * ngFor-on-complete, update this method. 
     */
    onAfterFor() {
        this.enableTooltipForOverflowedElements('.matchup-button')
    }

    /**
     * Prepares the match-up form based on what the user selected.
     *
     * There is only one match-up form: the form changes based upon what round
     * or match-up the user selects.
     *
     * `round` the selected round.
     * `config` (optional) the selected match-up. If not supplied, a new
     * match-up will be created.
     */
    prepareForm(round: Round, config?: MatchConfig) {
        if (config) {
            this.matchupButtonText = RoundListComponent.EDIT_MATCHUP
        } else {
            this.matchupButtonText = RoundListComponent.CREATE_MATCHUP
        }
        let fc = this.matchupForm.controls['round'] as FormControl
        fc.updateValue(round)
        fc = this.matchupForm.controls['config'] as FormControl
        fc.updateValue(config)
        if (config && config.homeTeamPreLoaded) {
            fc = this.matchupForm.controls['homeTeam'] as FormControl
            for (let team of this.homeTeamsAll) {
                if (team.id == config.homeTeamPreLoaded.id) {
                    fc.updateValue(team)
                    break
                }
            }
        }
        if (config && config.awayTeamPreLoaded) {
            fc = this.matchupForm.controls['awayTeam'] as FormControl
            for (let team of this.awayTeamsAll) {
                if (team.id == config.awayTeamPreLoaded.id) {
                    fc.updateValue(team)
                    break
                }
            }
        }
        this.removeTeamsAsAlreadyReserved(round,
            config ? config.homeTeamPreLoaded : null,
            config ? config.awayTeamPreLoaded : null)
    }

    /**
     * create the match-up in the database based on the user's responses to the
     * match-up form. Clears the form.
     */
    createMatchup(form: RoundForm) {
        this._roundService.addUpdateRound(form.round).then(() => {
            let config = form.config
            if (!config) {
                config = new MatchConfig()
            }
            config.setRound(form.round)
            config.setHomeTeam(form.homeTeam)
            config.setAwayTeam(form.awayTeam)
            let fc = this.matchupForm.controls['homeTeam'] as FormControl
            fc.updateValue(null)
            fc = this.matchupForm.controls['awayTeam'] as FormControl
            fc.updateValue(null)
            fc = this.matchupForm.controls['config'] as FormControl
            fc.updateValue(null)
            return this._matchConfigService.addMatchConfig(config)
        }).then(() => {
            return this._fixtureService.getRoundsAndConfig(this.fixture)
        }).then((rounds: Collection<Round>) => {
            this.rounds = rounds.toArray()
            this.fillInRounds()
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
        for (let i = 1; i <= this.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate); i++) {
            let index = Search.binarySearch(this.rounds, i, (a: number, b: Round) => {
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
     * Remove teams from the drop-down home and away teams list.
     *
     * If the user has reserved a match-up, remove from the list so the user
     * can't reserve the same team again on the same round.
     * 
     * `round` the round containing the match-ups
     * `homeTeam` (optional) Do not remove this home team from the home list,
     *      because the user is editing.
     * `awayTeam` (optional) Do not remove this away team from the away list,
     *      because the user is editing.
     */
    private removeTeamsAsAlreadyReserved(round: Round, homeTeam?: Team, awayTeam?: Team) {
        let configs = round.matchConfigsPreLoaded
        this.homeTeams = this.homeTeamsAll.slice(0) //copy
        this.awayTeams = this.awayTeamsAll.slice(0) //copy
        // config null if matchConfigsPreLoaded fails. If fails, show all teams
        if (configs) {
            for (let config of configs) {
                let count = 0
                for (let i = this.homeTeams.length - 1; i >= 0; i--) {
                    if ((this.homeTeams[i].id == config.homeTeam_id &&
                        // don't delete the homeTeam as requested
                        !(homeTeam && homeTeam.id == this.homeTeams[i].id))
                        ||
                        (this.homeTeams[i].id == config.awayTeam_id &&
                            // don't delete the awayTeam as requested
                            !(awayTeam && awayTeam.id == this.homeTeams[i].id))) {
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
                        this.awayTeams[i].id == config.awayTeam_id &&
                        // don't delete the awayTeam as requested
                        !(awayTeam && awayTeam.id == this.awayTeams[i].id))
                        ||
                        (this.awayTeams[i].id == config.homeTeam_id &&
                            // don't delete the homeTeam as requested
                            !(homeTeam && homeTeam.id == this.awayTeams[i].id))) {
                        this.awayTeams.splice(i, 1)
                        count++
                        if (count >= 2) {
                            break
                        }
                    }
                }
            }
        }
        this._changeref.detectChanges()
        if (!homeTeam) {
            let fc = this.matchupForm.controls['homeTeam'] as FormControl
            fc.updateValue(null)
        }
        if (!awayTeam) {
            let fc = this.matchupForm.controls['awayTeam'] as FormControl
            fc.updateValue(null)
        }
    }

    /**
     * Return the number of rounds between two dates.
     * 
     * The `startDate` can be any day of the week. If `startDate` is a weekend,
     * the round count will include that weekend, otherwise count starts at
     * next weekend. 
     * 
     * The `endDate` can be any day of the week. If `endDate` is a weekend, the
     * round count will include that weekend, otherwise count ends at the
     * previous weekend.
     * 
     * If both `startDate` and `endDate` are mid-week in the same week, the
     * returned round count will be 0.
     * 
     * If both `startDate` and `endDate` are on the weeked in the same week, the
     * returned round count will be 1.
     * 
     * If `startDate` is later than `endDate`, returned round count will be 0.
     */
    private getNumberOfRounds(startDate: Date, endDate: Date): number {
        let start = moment(startDate)
        let end = moment(endDate)
        if (start.day() == DaysOfWeek.Sunday) {
            start.subtract(1, 'day')
        } else if (start.day() < DaysOfWeek.Saturday) {
            start.add(DaysOfWeek.Saturday - start.day(), 'day')
        }
        if (end.day() < DaysOfWeek.Saturday) {
            end.subtract(end.day() + 1, 'day')
        }
        let daysdiff = end.diff(start, 'days')
        if (daysdiff < 0) {
            return 0
        } else if (daysdiff == 0) {
            return 1
        } else {
            return Math.round(daysdiff / 7) + 1
        }
    }

    /**
     * Validator to ensure different teams are selected. Can't reserve a
     * match-up of teamX vs teamX
     */
    private differentTeamsSelectedValidator = ({value}: FormGroup): { [key: string]: any } => {
        return value.homeTeam == value.awayTeam ? { equal: true } : null
    }

    /**
     * Enable a popup tooltip for overflowed elements. For example, if the
     * text is too long for the button, display a tooltip showing the whole
     * text.
     * 
     * `selector` is jQuery selector string to select the elements.
     */
    private enableTooltipForOverflowedElements(selector: string) {
        jQuery(selector).each((index, elem) => {
            let jElem = jQuery(elem)
            if (elem.scrollWidth > jElem.innerWidth()) {
                jElem.tooltip({
                    delay: { 'show': 1000, 'hide': 100 },
                    trigger: 'hover'
                })
            }
        })
    }

    private static CREATE_MATCHUP: string = 'Create Match-up'
    private static EDIT_MATCHUP: string = 'Edit Match-up'
    private matchupButtonText: string
    private initComplete: boolean = false
    private rounds: Round[] = []
    private homeTeams: Team[]
    private homeTeamsAll: Team[]
    private awayTeams: Team[]
    private awayTeamsAll: Team[]
    private fixture: Fixture
}
