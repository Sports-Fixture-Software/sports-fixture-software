import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Team } from '../models/team'
import { TeamConfig } from '../models/team_config'
import { TeamService } from '../services/team.service'
import { TeamConfigService } from '../services/team_config.service'
import { ButtonPopover } from './button_popover.component'
import { TeamForm } from '../models/team.form'
import { Subscription } from 'rxjs/Subscription'
import * as twitterBootstrap from 'bootstrap'
declare var jQuery: JQueryStatic

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_details.template.html',
    providers: [TeamService, TeamConfigService],
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES]
})

export class TeamDetailsComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private teamService: TeamService,
        private teamConfigService: TeamConfigService,
        private changeref: ChangeDetectorRef) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    @ViewChild('homeGamesMinInput') homeGamesMinInput: ElementRef
    @ViewChild('homeGamesMaxInput') homeGamesMaxInput: ElementRef
    @ViewChild('awayGamesMinInput') awayGamesMinInput: ElementRef
    @ViewChild('awayGamesMaxInput') awayGamesMaxInput: ElementRef
    editing: boolean = false
    teamForm: FormGroup

    ngOnInit() {
        this.teamForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            homeGamesMin: new FormControl('', [this.numberValidator]),
            homeGamesMax: new FormControl('', [this.numberValidator]),
            homeGamesEnabled: new FormControl(),
            awayGamesMin: new FormControl('', [this.numberValidator]),
            awayGamesMax: new FormControl('', [this.numberValidator]),
            awayGamesEnabled: new FormControl(),
        })
        this.fieldData.homeGamesMin = { state: State.Hidden } as PopoverFieldType
        this.fieldData.homeGamesMax = { state: State.Hidden } as PopoverFieldType
        this.fieldData.awayGamesMin = { state: State.Hidden } as PopoverFieldType
        this.fieldData.awayGamesMax = { state: State.Hidden } as PopoverFieldType
        this.route.params.forEach(params => {
            let id = +params['id']
            this.teamService.getTeamAndConfig(id).then(team => {
                this.team = team
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

    onEditTeam() {
        this.editing = true
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.resetForm()
        this.changeref.detectChanges()
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onHomeGamesEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.teamForm.controls['homeGamesMin'] as FormControl
            fc.updateValue(null, { emitEvent: false })
            fc = this.teamForm.controls['homeGamesMax'] as FormControl
            fc.updateValue(null, { emitEvent: false })
        }
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onAwayGamesEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.teamForm.controls['awayGamesMin'] as FormControl
            fc.updateValue(null, { emitEvent: false })
            fc = this.teamForm.controls['awayGamesMax'] as FormControl
            fc.updateValue(null, { emitEvent: false })
        }
    }

    /**
     *  Show an error popover if invalid user entry.
     *  If the user enters a value, check the box to enable. If the user is
     *  entering a value, it is assumed they want enabled checked.
     */
    onFieldChange(value: any, element: ElementRef, control: FormControl, controlPair: FormControl, enableControl: FormControl, popoverData: PopoverFieldType) {
        // if value blank and the control's pair is blank, disable
        if (typeof value === 'string' && value.trim() == '' && typeof controlPair.value === 'string' && controlPair.value.trim() == '' && enableControl) {
            enableControl.updateValue(false, { emitEvent: false })
        } else if (value && enableControl) {
            // user entered a value, assume they want enabled
            enableControl.updateValue(true, { emitEvent: false })
        }
        if (control.valid) {
            if (popoverData.element) {
                if (popoverData.state == State.Shown) {
                    popoverData.element.popover('hide')
                }
            }
        }
        else {
            if (popoverData.element) {
                if (popoverData.state == State.Hidden) {
                    popoverData.element.popover('show')
                } else if (popoverData.state == State.Hidding) {
                    popoverData.element.one('hidden.bs.popover', () => {
                        popoverData.element.popover('show')
                    })
                }
            } else {
                popoverData.element = jQuery(element.nativeElement).popover({ html: true, template: this.popoverTemplate, content: 'Please enter a number', placement: 'bottom', trigger: 'manual' }).on('show.bs.popover', () => {
                    popoverData.state = State.Showing
                }).on('shown.bs.popover', () => {
                    popoverData.state = State.Shown
                }).on('hide.bs.popover', () => {
                    popoverData.state = State.Hidding
                }).on('hidden.bs.popover', () => {
                    popoverData.state = State.Hidden
                }).popover('show')
            }
        }
    }

    updateTeam(form: TeamForm) {
        this.team.name = form.name
        let config = this.team.teamConfigPreLoaded
        if (!config) {
            config = new TeamConfig()
            config.setTeam(this.team)
        }
        config.homeGamesMin = Number.parseInt(form.homeGamesMin)
        config.homeGamesMin = Number.isInteger(config.homeGamesMin) ? config.homeGamesMin : null
        config.homeGamesMax = Number.parseInt(form.homeGamesMax)
        config.homeGamesMax = Number.isInteger(config.homeGamesMax) ? config.homeGamesMax : null
        config.awayGamesMin = Number.parseInt(form.awayGamesMin)
        config.awayGamesMin = Number.isInteger(config.awayGamesMin) ? config.awayGamesMin : null
        config.awayGamesMax = Number.parseInt(form.awayGamesMax)
        config.awayGamesMax = Number.isInteger(config.awayGamesMax) ? config.awayGamesMax : null
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.homeGamesEnabled && (form.homeGamesMin == null || form.homeGamesMin == '') && (form.homeGamesMax == null || form.homeGamesMax == '')) {
            let fc = this.teamForm.controls['homeGamesEnabled'] as FormControl
            fc.updateValue(false, { emitEvent: false })
        }
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.awayGamesEnabled && (form.awayGamesMin == null || form.awayGamesMin == '') && (form.awayGamesMax == null || form.awayGamesMax == '')) {
            let fc = this.teamForm.controls['awayGamesEnabled'] as FormControl
            fc.updateValue(false, { emitEvent: false })
        }
        this.teamService.addTeam(this.team).then(() => {
            return this.teamConfigService.addTeamConfig(config)
        }).then(() => {
            this.editing = false
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes', err.message)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        let fc = this.teamForm.controls['name'] as FormControl
        fc.updateValue(this.team.name)
        if (this.team.teamConfigPreLoaded) {
            fc = this.teamForm.controls['homeGamesMin'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.homeGamesMin)
            if (!this.listeners.homeGamesMin) {
                this.listeners.homeGamesMin = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.homeGamesMinInput, this.teamForm.controls['homeGamesMin'] as FormControl,
                        this.teamForm.controls['homeGamesMax'] as FormControl, this.teamForm.controls['homeGamesEnabled'] as FormControl, this.fieldData.homeGamesMin)
                })
            }
            fc = this.teamForm.controls['homeGamesMax'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.homeGamesMax)
            if (!this.listeners.homeGamesMax) {
                this.listeners.homeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.homeGamesMaxInput, this.teamForm.controls['homeGamesMax'] as FormControl,
                        this.teamForm.controls['homeGamesMin'] as FormControl, this.teamForm.controls['homeGamesEnabled'] as FormControl, this.fieldData.homeGamesMax)
                })
            }
            fc = this.teamForm.controls['awayGamesMin'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.awayGamesMin)
            if (!this.listeners.awayGamesMin) {
                this.listeners.awayGamesMin = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.awayGamesMinInput, this.teamForm.controls['awayGamesMin'] as FormControl, this.teamForm.controls['awayGamesMax'] as FormControl, this.teamForm.controls['awayGamesEnabled'] as FormControl, this.fieldData.awayGamesMin)
                })
            }
            fc = this.teamForm.controls['awayGamesMax'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.awayGamesMax)
            if (!this.listeners.awayGamesMax) {
                this.listeners.awayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.awayGamesMaxInput, this.teamForm.controls['awayGamesMax'] as FormControl,
                        this.teamForm.controls['awayGamesMin'] as FormControl, this.teamForm.controls['awayGamesEnabled'] as FormControl, this.fieldData.awayGamesMax)
                })
            }
        }
        fc = this.teamForm.controls['homeGamesEnabled'] as FormControl
        fc.updateValue(this.team.teamConfigPreLoaded && (this.team.teamConfigPreLoaded.homeGamesMin != null || this.team.teamConfigPreLoaded.homeGamesMax != null))
        if (!this.listeners.homeGamesEnabled) {
            this.listeners.homeGamesEnabled = fc.valueChanges.subscribe((evt) => {
                this.onHomeGamesEnabledChange(evt)
            })
        }
        fc = this.teamForm.controls['awayGamesEnabled'] as FormControl
        fc.updateValue(this.team.teamConfigPreLoaded && (this.team.teamConfigPreLoaded.awayGamesMin != null || this.team.teamConfigPreLoaded.awayGamesMax != null))
        if (!this.listeners.awayGamesEnabled) {
            this.listeners.awayGamesEnabled = fc.valueChanges.subscribe((evt) => {
                this.onAwayGamesEnabledChange(evt)
            })
        }
    }

    /**
     * Validator to ensure a non-negative whole number number, or blank.
     */
    private numberValidator = (control: FormControl): { [key: string]: any } => {
        if (control.value == null) {
            return null
        }
        if (typeof control.value === 'string' && control.value.trim() == '') {
            return null
        }
        if (Number(control.value) < 0) {
            return { Negative: true }
        }
        return Number.isInteger(Number(control.value)) ? null : { NaN: true }
    }

    private fieldData: FieldDataType = {} as FieldDataType
    private team: Team
    private listeners: ListenerType = {} as ListenerType
    private popoverTemplate = '<div class="popover" role="tooltip" style="min-width:200px"><div class="arrow"></div><h3 class="popover-title"></h3><div class="alert alert-s alert-danger" role="alert"><span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span><span class="sr-only">Error:</span><div class="popover-content popover-content-s"></div></div></div>'
}

interface ListenerType {
    homeGamesMin: Subscription,
    homeGamesMax: Subscription,
    homeGamesEnabled: Subscription,
    awayGamesMin: Subscription,
    awayGamesMax: Subscription,
    awayGamesEnabled: Subscription
}
interface PopoverFieldType {
    element: JQuery,
    state: State
}
interface FieldDataType {
    homeGamesMin: PopoverFieldType,
    homeGamesMax: PopoverFieldType,
    awayGamesMin: PopoverFieldType,
    awayGamesMax: PopoverFieldType
}
enum State {
    Hidden,
    Hidding,
    Shown,
    Showing
}
