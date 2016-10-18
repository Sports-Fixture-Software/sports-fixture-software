import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { FixtureService } from '../services/fixture.service'
import { MatchService } from '../services/match.service'
import { Collection } from '../services/collection'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import { Team } from '../models/team'
import { Match } from '../models/match'
import { ReviewForm } from '../models/review.form'
import { Validator } from '../util/validator'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { PopoverContent } from 'ng2-popover'
import { FileFolder } from '../util/file_folder'
import { ExportTo } from '../util/export_to'
import { ButtonPopover } from './button_popover.component'
import { ButtonHidden } from './button_hidden.component'
import * as electron from 'electron'
import * as fs from 'fs'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService, MatchService],
    templateUrl: 'review.template.html'
})

export class ReviewComponent implements OnInit, OnDestroy {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _matchService: MatchService,
        private _router: Router,
        private route: ActivatedRoute) {
    }

    matchupForm: FormGroup
    @ViewChild('saveFixtureButton') saveFixtureButton: ButtonPopover
    @ViewChild('createMatchupPopover') createMatchupPopover: PopoverContent
    @ViewChild('deleteMatchupButton') deleteMatchupButton: ButtonPopover
    @ViewChild('createMatchupButton') createMatchupButton: ButtonPopover
    error: Error

    ngOnInit() {
        this.matchupForm = new FormGroup({
            round: new FormControl(),
            homeTeam: new FormControl('', [<any>Validators.required]),
            awayTeam: new FormControl('', [<any>Validators.required]),
            match: new FormControl()
        }, null, Validator.differentTeamsSelected)
        this.routeSubscription = this.route.parent.params.subscribe(params => {
            let id = +params['id'];
            this._fixtureService.getFixtureAndTeams(id).then((f) => {
                this.fixture = f
                this.homeTeamsAll = this.fixture.leaguePreLoaded.teamsPreLoaded.toArray()
                this.awayTeamsAll = this.homeTeamsAll.slice(0)
                let byeTeam = new Team('Bye')
                byeTeam.id = null
                this.awayTeamsAll.push(byeTeam)
                return this._fixtureService.getRoundsAndMatches(f)
            }).then((rounds: Collection<Round>) => {
                this.rounds = rounds.toArray()
                this._changeref.detectChanges()
            }).catch((err: Error) => {
                let detail = err ? err.message : ''
                this.error = new Error(`Error loading rounds: ${detail}`)
                this._changeref.detectChanges()
            })
        })
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    onEditFixture() {
        this.editingFixture = !this.editingFixture
        this.editFixtureLabel = this.editingFixture ? ReviewComponent.VIEW_FIXTURE : ReviewComponent.EDIT_FIXTURE
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
     * `match` the selected match-up.
     */
    prepareForm(round: Round, match: Match) {
        if (match) {
            this.editingMatch = true
            this.matchupButtonText = ReviewComponent.EDIT_MATCHUP
        } else {
            this.matchupButtonText = ReviewComponent.CREATE_MATCHUP
            this.editingMatch = false
        }
        this.matchupForm.patchValue({
            round: round,
            match: match
        })
        if (match && match.homeTeamPreLoaded) {
            for (let team of this.homeTeamsAll) {
                if (team.id == match.homeTeamPreLoaded.id) {
                    this.matchupForm.patchValue({homeTeam: team})
                    break
                }
            }
        }
        if (match && match.awayTeamPreLoaded) {
            for (let team of this.awayTeamsAll) {
                if (team.id == match.awayTeamPreLoaded.id) {
                    this.matchupForm.patchValue({awayTeam: team})
                    break
                }
            }
        }
    }

    /**
     * create the match-up in the database based on the user's responses to
     * the match-up form.
     */
    createMatchup(form: ReviewForm) {
        let match = form.match
        if (!form.match) {
            match = new Match()
        }
        match.setRound(form.round)
        match.setHomeTeam(form.homeTeam)
        match.setAwayTeam(form.awayTeam)

        this.matchupForm.patchValue({
            homeTeam: null,
            awayTeam: null,
            match: null
        })
        
        this._matchService.addMatch(match).then(() => {
            return this._fixtureService.getRoundsAndMatches(this.fixture)
        }).then((rounds: Collection<Round>) => {
            this.rounds = rounds.toArray()
            this.createMatchupPopover.hide()
            this._changeref.detectChanges()
        }).catch((err: Error) => {
            this.createMatchupButton.showError('Error saving match-up', err.message)
        })
    }

    deleteMatchup(form: ReviewForm) {
        if (form.match) {
            this._matchService.deleteMatch(form.match).then(() => {
                return this._fixtureService.getRoundsAndMatches(this.fixture)
            }).then((rounds: Collection<Round>) => {
                this.rounds = rounds.toArray()
                this.createMatchupPopover.hide()
                this._changeref.detectChanges()
            }).catch((err: Error) => {
                this.deleteMatchupButton.showError('Error deleting match-up', err.message)
            })
        } else {
            this.deleteMatchupButton.showError('Error deleting match-up', 'The match-up could not be found')
        }
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

    /**
     * Show a Save As dialog and write the CSV. Errors are displayed as a
     * popover to the Save Fixture button.
     */
    onSaveFixture() {
        this.showSaveDialog().then((res: string) => {
            return FileFolder.createWriteStream(res)
        }).then((stream: fs.WriteStream) => {
            ExportTo.CSV(stream, this.rounds)
            stream.end()
            stream.close()
        }).catch((err: Error) => {
            if (err instanceof UserCancelled) {
                // don't show error - the user cancelled
            } else {
                this.saveFixtureButton.showError('Error saving fixture', err.message)
                this._changeref.detectChanges()
            }
        })
    }

    /**
     * Shows the Save As dialog. The Save As dialog checks if the file exists
     * and asks if to overwrite. The Save As dialog checks for write permission.
     *
     * Returns a string of the selected file.
     */
    private showSaveDialog(): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            electron.remote.dialog.showSaveDialog(
                {
                    title: "Save Fixture",
                    filters: [
                        { name: 'Comma-Separated Values (CSV)', extensions: ['csv'] },
                        { name: 'All Files', extensions: ['*'] }
                    ]
                }, (res: string) => {
                    if (res) {
                        return resolve(res)
                    } else {
                        return reject(new UserCancelled())
                    }
                })
        })
    }

    /**
     * Determines if a team is repeated in a round.
     *
     * `round` the selected round.
     * `match` the selected match-up.
     * Returns `true` if a team exists twice or more in a round,
     * false otherwise.
     */
    isTeamRepeated(round: Round, team: Team): boolean {
        if (team.id == null) { // bye
            return false
        }
        let count = 0
        for (let match of round.matchesPreLoaded) {
            if (match.homeTeam_id == team.id || match.awayTeam_id == team.id) {
                count++
                if (count > 1) {
                    return true
                }
            }
        }
        return count > 1 ? true : false
    }

    private matchupButtonText: string
    private editFixtureLabel: string = ReviewComponent.EDIT_FIXTURE
    private editingFixture: boolean = false
    private editingMatch: boolean
    private rounds: Round[] = []
    private homeTeamsAll: Team[]
    private awayTeamsAll: Team[]
    private fixture: Fixture
    private routeSubscription: Subscription
    private static CREATE_MATCHUP: string = 'Create Match-up'
    private static EDIT_MATCHUP: string = 'Edit Match-up'
    private static EDIT_FIXTURE: string = 'Edit Fixture'
    private static VIEW_FIXTURE: string = 'View Fixture'
}

class UserCancelled extends Error { }
