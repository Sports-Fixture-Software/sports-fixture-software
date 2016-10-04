import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { Validators } from '@angular/common'
import { FixtureService } from '../services/fixture.service'
import { Collection } from '../services/collection'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import { Validator } from '../util/validator'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover'
import { FileFolder } from '../util/file_folder'
import { ExportTo } from '../util/export_to'
import { ButtonPopover } from './button_popover.component'
import * as electron from 'electron'
import * as fs from 'fs'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService],
    directives: [ButtonPopover, POPOVER_DIRECTIVES, REACTIVE_FORM_DIRECTIVES],
    templateUrl: 'review.template.html'
})

export class ReviewComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }

    matchupForm: FormGroup
    @ViewChild('saveFixtureButton') saveFixtureButton: ButtonPopover
    error: Error

    ngOnInit() {
        this.matchupForm = new FormGroup({
            round: new FormControl(),
            homeTeam: new FormControl('', [<any>Validators.required]),
            awayTeam: new FormControl('', [<any>Validators.required]),
            config: new FormControl()
        }, {}, Validator.differentTeamsSelected)
        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._fixtureService.getFixture(id).then((f) => {
                    this.fixture = f
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

    onEditFixture() {
        this.editing = !this.editing
        this.editFixtureLabel = this.editing ? ReviewComponent.VIEW_FIXTURE : ReviewComponent.EDIT_FIXTURE
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
     * `config` the selected match-up.
     */
    prepareForm(round: Round, config?: MatchConfig) {
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
                    buttonLabel: "Save Fixture",
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

    private editFixtureLabel: string = ReviewComponent.EDIT_FIXTURE
    private editing: boolean = false
    private rounds: Round[] = []
    private fixture: Fixture
    private static EDIT_FIXTURE: string = 'Edit Fixture'
    private static VIEW_FIXTURE: string = 'View Fixture'
}

class UserCancelled extends Error { }
