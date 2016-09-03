import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Fixture } from '../models/fixture'
import { FixtureService } from '../services/fixture.service'
import { ButtonPopover } from './button_popover.component'
import { FixtureForm } from '../models/fixture.form'
import { Subscription } from 'rxjs/Subscription'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_details.template.html',
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES]
})

export class FixtureDetailsComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private fixtureService: FixtureService,
        private changeref: ChangeDetectorRef) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    editing: boolean = false
    fixtureForm: FormGroup

    ngOnInit() {
        this.fixtureForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            description: new FormControl('', [<any>Validators.required]),
            startDate: new FormControl('', [<any>Validators.required]),
            startDateEnabled: new FormControl('', [<any>Validators.required]),
            endDate: new FormControl('', [<any>Validators.required]),
            endDateEnabled: new FormControl('', [<any>Validators.required]),
        })
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.fixtureService.getFixture(id).then(fixture => {
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

    /**
     *  If the user unchecks, clear the entered date
     */
    onStartDateEnabledChange(value : boolean) {
        if (!value) {
            let fc = this.fixtureForm.controls['startDate'] as FormControl
            fc.updateValue(null, {emitEvent : false})
        }
    }

    /**
     *  If the user enters a date, check the box to enable. If the user is
     *  entering a date, it is assumed they want it used
     */
    onStartDateChange(value : Date) {
        if (value) {
            let fc = this.fixtureForm.controls['startDateEnabled'] as FormControl
            fc.updateValue(true, {emitEvent : false})
        }
    }

    /**
     *  If the user unchecks, clear the entered date
     */
    onEndDateEnabledChange(value : boolean) {
        if (!value) {
            let fc = this.fixtureForm.controls['endDate'] as FormControl
            fc.updateValue(null, {emitEvent : false})
        }
    }

    /**
     *  If the user enters a date, check the box to enable. If the user is
     *  entering a date, it is assumed they want it used
     */
    onEndDateChange(value : Date) {
        if (value) {
            let fc = this.fixtureForm.controls['endDateEnabled'] as FormControl
            fc.updateValue(true, {emitEvent : false})
        }
    }

    updateFixture(form: FixtureForm) {
        this.fixture.name = form.name
        this.fixture.description = form.description
        // if user checked the date, but didn't enter a date, turn the checked
        // off
        if (form.startDateEnabled && !form.startDate) {
            let fc = this.fixtureForm.controls['startDateEnabled'] as FormControl
            fc.updateValue(false, {emitEvent : false})
        }
        // if user checked the date, but didn't enter a date, turn the checked
        // off
        if (form.endDateEnabled && !form.endDate) {
            let fc = this.fixtureForm.controls['endDateEnabled'] as FormControl
            fc.updateValue(false, {emitEvent : false})
        }
        this.fixture.startDate = form.startDate
        this.fixture.endDate = form.endDate
        this.fixtureService.updateFixture(this.fixture).then((f) => {
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
        fc.updateValue(this.fixture.startDate)
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
        fc.updateValue(this.fixture.endDate)
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
    }

    private fixture: Fixture
    private listeners : listenerType = {} as listenerType
}

interface listenerType {
        startDate: Subscription,
        startDateEnabled: Subscription,
        endDate: Subscription,
        endDateEnabled: Subscription
}
