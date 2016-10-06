import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Fixture } from '../models/fixture'
import { FixtureConfig } from '../models/fixture_config'
import { FixtureService } from '../services/fixture.service'
import { FixtureConfigService } from '../services/fixture_config.service'
import { ButtonPopover } from './button_popover.component'
import { InputPopover } from './input_popover.component'
import { FixtureForm } from '../models/fixture.form'
import { Subscription } from 'rxjs/Subscription'
import { POPOVER_DIRECTIVES } from 'ng2-popover'
import { Validator } from '../util/validator'
import * as moment from 'moment'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_details.template.html',
    providers: [FixtureService, FixtureConfigService],
    directives: [ButtonPopover, InputPopover, REACTIVE_FORM_DIRECTIVES, POPOVER_DIRECTIVES]
})

export class FixtureDetailsComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private fixtureService: FixtureService,
        private fixtureConfigService: FixtureConfigService,
        private changeref: ChangeDetectorRef,
        private zone: NgZone) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    @ViewChild('deleteFixtureButton') deleteFixtureButton: ButtonPopover
    @ViewChild('consecutiveHomeGamesMaxInput') consecutiveHomeGamesMaxInput: InputPopover
    @ViewChild('consecutiveAwayGamesMaxInput') consecutiveAwayGamesMaxInput: InputPopover
    editing: boolean = false
    fixtureForm: FormGroup

    ngOnInit() {
        this.fixtureForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            description: new FormControl(''),
            startDate: new FormControl(),
            startDateEnabled: new FormControl(false),
            endDate: new FormControl(),
            endDateEnabled: new FormControl(false),
            consecutiveHomeGamesMaxEnabled: new FormControl(),
            consecutiveHomeGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)]),
            consecutiveAwayGamesMaxEnabled: new FormControl(),
            consecutiveAwayGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)])
        })
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.fixtureService.getFixtureAndLeagueAndConfig(id).then(fixture => {
                    this.fixture = fixture
                    this.resetForm()
                    this.changeref.detectChanges()
                })
            })
    }

    ngOnDestroy() {
        for (let i in this.listeners) {
            let listener = this.listeners[i] as Subscription
            listener.unsubscribe()
        }
    }

    onEditFixture() {
        this.editing = true
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.resetForm()
        this.changeref.detectChanges()
    }

    onDeleteFixture() {
        this.fixtureService.deleteFixture(this.fixture).then(() => {
            this.zone.run(() => {
                this.router.navigate(['league'])
            })
        }).catch((err: Error) => {
            this.deleteFixtureButton.showError('Error deleting fixture',
                err.message)
            this.changeref.detectChanges()
        })
    }

    /**
     *  If the user unchecks, clear the entered date
     */
    onStartDateEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.fixtureForm.controls['startDate'] as FormControl
            fc.updateValue(null, { emitEvent: false })
        }
    }

    /**
     *  If the user enters a date, check the box to enable. If the user is
     *  entering a date, it is assumed they want it used
     */
    onStartDateChange(value: string) {
        if (value) {
            let fc = this.fixtureForm.controls['startDateEnabled'] as FormControl
            fc.updateValue(true, { emitEvent: false })
        }
    }

    /**
     *  If the user unchecks, clear the entered date
     */
    onEndDateEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.fixtureForm.controls['endDate'] as FormControl
            fc.updateValue(null, { emitEvent: false })
        }
    }

    /**
     *  If the user enters a date, check the box to enable. If the user is
     *  entering a date, it is assumed they want it used
     */
    onEndDateChange(value: string) {
        if (value) {
            let fc = this.fixtureForm.controls['endDateEnabled'] as FormControl
            fc.updateValue(true, { emitEvent: false })
        }
    }

    /**
     *  Show an error popover if invalid user entry.
     */
    onFieldChange(element: InputPopover, control: FormControl) {
        if (element) {
            if (control.valid) {
                element.hideError()
            }
            else {
                element.showError(`Please enter a number greater than ${Validator.CONSECUTIVE_GAMES_MIN - 1}`)
            }
        }
    }

    updateFixture(form: FixtureForm) {
        this.fixture.name = form.name
        this.fixture.description = form.description
        // if user checked the date, but didn't enter a date, turn the checked
        // off
        if (form.startDateEnabled && !form.startDate) {
            let fc = this.fixtureForm.controls['startDateEnabled'] as FormControl
            fc.updateValue(false, { emitEvent: false })
        }
        // if user checked the date, but didn't enter a date, turn the checked
        // off
        if (form.endDateEnabled && !form.endDate) {
            let fc = this.fixtureForm.controls['endDateEnabled'] as FormControl
            fc.updateValue(false, { emitEvent: false })
        }
        this.fixture.startDate = moment(form.startDate, 'YYYY-MM-DD')
        this.fixture.endDate = moment(form.endDate, 'YYYY-MM-DD')

        let config = this.fixture.fixtureConfigPreLoaded
        if (!config) {
            config = new FixtureConfig()
            config.setFixture(this.fixture)
        }
        if (form.consecutiveHomeGamesMaxEnabled) {
            if (form.consecutiveHomeGamesMax == null || (typeof form.consecutiveHomeGamesMax === 'string' && form.consecutiveHomeGamesMax.trim() == '')) {
                // if user checked the checkbox, but didn't enter a value, turn
                // the checked off
                let fc = this.fixtureForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl
                fc.updateValue(false, { emitEvent: false })
            }
            config.consecutiveHomeGamesMax = Number.parseInt(form.consecutiveHomeGamesMax)
            config.consecutiveHomeGamesMax = Number.isInteger(config.consecutiveHomeGamesMax) ? config.consecutiveHomeGamesMax : null
        } else {
            config.consecutiveHomeGamesMax = null
        }
        if (form.consecutiveAwayGamesMaxEnabled) {
            if (form.consecutiveAwayGamesMax == null || (typeof form.consecutiveAwayGamesMax === 'string' && form.consecutiveAwayGamesMax.trim() == '')) {
                // if user checked the checkbox, but didn't enter a value, turn
                // the checked off
                let fc = this.fixtureForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl
                fc.updateValue(false, { emitEvent: false })
            }
            config.consecutiveAwayGamesMax = Number.parseInt(form.consecutiveAwayGamesMax)
            config.consecutiveAwayGamesMax = Number.isInteger(config.consecutiveAwayGamesMax) ? config.consecutiveAwayGamesMax : null
        } else {
            config.consecutiveAwayGamesMax = null
        }

        this.fixtureService.updateFixture(this.fixture).then((f) => {
            return this.fixtureConfigService.addFixtureConfig(config)
        }).then(() => {
            this.editing = false
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes', err.message)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        let fc = this.fixtureForm.controls['name'] as FormControl
        fc.updateValue(this.fixture.name)
        fc = this.fixtureForm.controls['description'] as FormControl
        fc.updateValue(this.fixture.description)
        fc = this.fixtureForm.controls['startDate'] as FormControl
        fc.updateValue(this.fixture.startDate.format('YYYY-MM-DD'))
        if (!this.listeners.startDate) {
            this.listeners.startDate = fc.valueChanges.subscribe((evt) => {
                this.onStartDateChange(evt)
            })
        }
        fc = this.fixtureForm.controls['startDateEnabled'] as FormControl
        fc.updateValue(this.fixture.startDate)
        if (!this.listeners.startDateEnabled) {
            this.listeners.startDateEnabled = fc.valueChanges.subscribe((evt) => {
                this.onStartDateEnabledChange(evt)
            })
        }
        fc = this.fixtureForm.controls['endDate'] as FormControl
        fc.updateValue(this.fixture.endDate.format('YYYY-MM-DD'))
        if (!this.listeners.endDate) {
            this.listeners.endDate = fc.valueChanges.subscribe((evt) => {
                this.onEndDateChange(evt)
            })
        }
        fc = this.fixtureForm.controls['endDateEnabled'] as FormControl
        fc.updateValue(this.fixture.endDate)
        if (!this.listeners.endDateEnabled) {
            this.listeners.endDateEnabled = fc.valueChanges.subscribe((evt) => {
                this.onEndDateEnabledChange(evt)
            })
        }

        if (this.fixture.fixtureConfigPreLoaded) {
            fc = this.fixtureForm.controls['consecutiveHomeGamesMax'] as FormControl
            fc.updateValue(this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax)
            if (!this.listeners.consecutiveHomeGamesMax) {
                this.listeners.consecutiveHomeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(this.consecutiveHomeGamesMaxInput, this.fixtureForm.controls['consecutiveHomeGamesMax'] as FormControl)
                })
            }
            fc = this.fixtureForm.controls['consecutiveAwayGamesMax'] as FormControl
            fc.updateValue(this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax)
            if (!this.listeners.consecutiveAwayGamesMax) {
                this.listeners.consecutiveAwayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(this.consecutiveAwayGamesMaxInput, this.fixtureForm.controls['consecutiveAwayGamesMax'] as FormControl)
                })
            }
        }
        fc = this.fixtureForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl
        fc.updateValue(this.fixture.fixtureConfigPreLoaded && this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax != null)
        fc = this.fixtureForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl
        fc.updateValue(this.fixture.fixtureConfigPreLoaded && this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax != null)
    }

    private fixture: Fixture
    private listeners: listenerType = {} as listenerType
}

interface listenerType {
    startDate: Subscription,
    startDateEnabled: Subscription,
    endDate: Subscription,
    endDateEnabled: Subscription,
    consecutiveHomeGamesMax: Subscription,
    consecutiveAwayGamesMax: Subscription
}
