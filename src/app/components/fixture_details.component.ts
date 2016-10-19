import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Fixture } from '../models/fixture'
import { FixtureConfig } from '../models/fixture_config'
import { FixtureService } from '../services/fixture.service'
import { FixtureConfigService } from '../services/fixture_config.service'
import { ButtonPopover } from './button_popover.component'
import { InputPopover } from './input_popover.component'
import { FixtureForm } from '../models/fixture.form'
import { AppConfig } from '../util/app_config'
import { Subscription } from 'rxjs/Subscription'
import { Validator } from '../util/validator'
import * as moment from 'moment'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_details.template.html',
    providers: [FixtureService, FixtureConfigService]
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
            startDateEnabled: new FormControl({ value: false, disabled: true }),
            endDate: new FormControl(),
            endDateEnabled: new FormControl({ value: false, disabled: true }),
            consecutiveHomeGamesMaxEnabled: new FormControl({ value: null, disabled: true }),
            consecutiveHomeGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)]),
            consecutiveAwayGamesMaxEnabled: new FormControl({ value: null, disabled: true }),
            consecutiveAwayGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)])
        })

        this.routeSubscription = this.route.parent.params.subscribe(params => {
            let id = +params['id']
            this.fixtureService.getFixtureAndLeagueAndConfig(id).then(fixture => {
                this.fixture = fixture
                this.resetForm()
                this.changeref.detectChanges()
            })
        });
    }

    ngOnDestroy() {
        for (let i in this.listeners) {
            let listener = this.listeners[i] as Subscription
            listener.unsubscribe()
        }
        this.routeSubscription.unsubscribe();
    }

    onEditFixture() {
        this.editing = true
        this.fixtureForm.get('startDateEnabled').enable()
        this.fixtureForm.get('endDateEnabled').enable()
        this.fixtureForm.get('consecutiveHomeGamesMaxEnabled').enable()
        this.fixtureForm.get('consecutiveAwayGamesMaxEnabled').enable()
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.fixtureForm.get('startDateEnabled').disable()
        this.fixtureForm.get('endDateEnabled').disable()
        this.fixtureForm.get('consecutiveHomeGamesMaxEnabled').disable()
        this.fixtureForm.get('consecutiveAwayGamesMaxEnabled').disable()
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
                'A database error occurred when deleting the fixture. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this.changeref.detectChanges()
        })
    }

    /**
     *  If the user unchecks, clear the entered date
     */
    onStartDateEnabledChange(value: boolean) {
        if (!value) {
            this.fixtureForm.patchValue({ startDate: null });
        }
    }

    /**
     *  If the user enters a date, check the box to enable. If the user is
     *  entering a date, it is assumed they want it used
     */
    onStartDateChange(value: string) {
        if (value) {
            this.fixtureForm.patchValue({ startDateEnabled: true });
        }
    }

    /**
     *  If the user unchecks, clear the entered date
     */
    onEndDateEnabledChange(value: boolean) {
        if (!value) {
            this.fixtureForm.patchValue({ endDate: null });
        }
    }

    /**
     *  If the user enters a date, check the box to enable. If the user is
     *  entering a date, it is assumed they want it used
     */
    onEndDateChange(value: string) {
        if (value) {
            this.fixtureForm.patchValue({ endDateEnabled: true });
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
            this.fixtureForm.patchValue({ startDateEnabled: false });
        }
        // if user checked the date, but didn't enter a date, turn the checked
        // off
        if (form.endDateEnabled && !form.endDate) {
            this.fixtureForm.patchValue({ endDateEnabled: false });
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
                this.fixtureForm.patchValue({ consecutiveHomeGamesMaxEnabled: false });
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
                this.fixtureForm.patchValue({ consecutiveAwayGamesMaxEnabled: false });
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
            this.fixtureForm.get('startDateEnabled').disable()
            this.fixtureForm.get('endDateEnabled').disable()
            this.fixtureForm.get('consecutiveHomeGamesMaxEnabled').disable()
            this.fixtureForm.get('consecutiveAwayGamesMaxEnabled').disable()
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes',
                'A database error occurred when saving the fixture. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        this.fixtureForm.patchValue({
            name: this.fixture.name,
            description: this.fixture.description,
            startDate: this.fixture.startDate.isValid() ? this.fixture.startDate.format('YYYY-MM-DD') : null,
            startDateEnabled: this.fixture.startDate.isValid(),
            endDate: this.fixture.endDate.isValid() ? this.fixture.endDate.format('YYYY-MM-DD') : null,
            endDateEnabled: this.fixture.endDate.isValid(),
            consecutiveHomeGamesMax: this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax,
            consecutiveAwayGamesMax: this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax,
            consecutiveHomeGamesMaxEnabled: this.fixture.fixtureConfigPreLoaded && this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax != null,
            consecutiveAwayGamesMaxEnabled: this.fixture.fixtureConfigPreLoaded && this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax != null
        });

        if (!this.listeners.startDate) {
            let fc = this.fixtureForm.controls['startDate'] as FormControl
            this.listeners.startDate = fc.valueChanges.subscribe((evt) => {
                this.onStartDateChange(evt)
            })
        }
        if (!this.listeners.startDateEnabled) {
            let fc = this.fixtureForm.controls['startDateEnabled'] as FormControl
            this.listeners.startDateEnabled = fc.valueChanges.subscribe((evt) => {
                this.onStartDateEnabledChange(evt)
            })
        }
        if (!this.listeners.endDate) {
            let fc = this.fixtureForm.controls['endDate'] as FormControl
            this.listeners.endDate = fc.valueChanges.subscribe((evt) => {
                this.onEndDateChange(evt)
            })
        }
        if (!this.listeners.endDateEnabled) {
            let fc = this.fixtureForm.controls['endDateEnabled'] as FormControl
            this.listeners.endDateEnabled = fc.valueChanges.subscribe((evt) => {
                this.onEndDateEnabledChange(evt)
            })
        }

        if (this.fixture.fixtureConfigPreLoaded) {
            if (!this.listeners.consecutiveHomeGamesMax) {
                let fc = this.fixtureForm.controls['consecutiveHomeGamesMax'] as FormControl
                this.listeners.consecutiveHomeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(this.consecutiveHomeGamesMaxInput, this.fixtureForm.controls['consecutiveHomeGamesMax'] as FormControl)
                })
            }
            if (!this.listeners.consecutiveAwayGamesMax) {
                let fc = this.fixtureForm.controls['consecutiveAwayGamesMax'] as FormControl
                this.listeners.consecutiveAwayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(this.consecutiveAwayGamesMaxInput, this.fixtureForm.controls['consecutiveAwayGamesMax'] as FormControl)
                })
            }
        }
    }

    private fixture: Fixture
    private listeners: listenerType = {} as listenerType
    private routeSubscription: Subscription
}

interface listenerType {
    startDate: Subscription,
    startDateEnabled: Subscription,
    endDate: Subscription,
    endDateEnabled: Subscription,
    consecutiveHomeGamesMax: Subscription,
    consecutiveAwayGamesMax: Subscription
}
