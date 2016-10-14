import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { League } from '../models/league'
import { LeagueConfig } from '../models/league_config'
import { LeagueService } from '../services/league.service'
import { LeagueConfigService } from '../services/league_config.service'
import { ButtonPopover } from './button_popover.component'
import { InputPopover } from './input_popover.component'
import { LeagueForm } from '../models/league.form'
import { Validator } from '../util/validator'
import { AppConfig } from '../util/app_config'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover'
import { Subscription } from 'rxjs/Subscription'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league_details.template.html',
    providers: [LeagueService, LeagueConfigService],
    directives: [ButtonPopover, InputPopover, REACTIVE_FORM_DIRECTIVES, POPOVER_DIRECTIVES]
})

export class LeagueDetailsComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private leagueService: LeagueService,
        private leagueConfigService: LeagueConfigService,
        private changeref: ChangeDetectorRef,
        private zone: NgZone) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    @ViewChild('deleteLeagueButton') deleteLeagueButton: ButtonPopover
    @ViewChild('consecutiveHomeGamesMaxInput') consecutiveHomeGamesMaxInput: InputPopover
    @ViewChild('consecutiveAwayGamesMaxInput') consecutiveAwayGamesMaxInput: InputPopover
    editing: boolean = false
    leagueForm: FormGroup

    ngOnInit() {
        this.leagueForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            consecutiveHomeGamesMaxEnabled: new FormControl(),
            consecutiveHomeGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)]),
            consecutiveAwayGamesMaxEnabled: new FormControl(),
            consecutiveAwayGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)])
        })
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.leagueService.getLeagueAndConfig(id).then(league => {
                    this.league = league
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

    onEditLeague() {
        this.editing = true
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.resetForm()
        this.changeref.detectChanges()
    }

    onDeleteLeague() {
        this.leagueService.deleteLeague(this.league).then(() => {
            this.zone.run(() => {
                this.router.navigate(['league'])
            })
        }).catch((err: Error) => {
            this.deleteLeagueButton.showError('Error deleting league',
                'A database error occurred when deleting the league. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this.changeref.detectChanges()
        })
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onConsecutiveHomeGamesMaxEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.leagueForm.controls['consecutiveHomeGamesMax'] as FormControl
            fc.updateValue(null, { emitEvent: false })
        }
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onConsecutiveAwayGamesMaxEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.leagueForm.controls['consecutiveAwayGamesMax'] as FormControl
            fc.updateValue(null, { emitEvent: false })
        }
    }

    /**
     *  Show an error popover if invalid user entry.
     *  If the user enters a value, check the box to enable. If the user is
     *  entering a value, it is assumed they want enabled checked.
     */
    onFieldChange(value: any, element: InputPopover, control: FormControl, enableControl: FormControl) {
        // if value blank, disable
        if (typeof value === 'string' && value.trim() == '' && enableControl) {
            enableControl.updateValue(false, { emitEvent: false })
        } else if (value && enableControl) {
            // user entered a value, assume they want enabled
            enableControl.updateValue(true, { emitEvent: false })
        }
        if (control.valid) {
            element.hideError()
        }
        else {
            element.showError(`Please enter a number greater than ${Validator.CONSECUTIVE_GAMES_MIN-1}`)
        }
    }

    updateLeague(form: LeagueForm) {
        this.league.name = form.name
        let config = this.league.leagueConfigPreLoaded
        if (!config) {
            config = new LeagueConfig()
            config.setLeague(this.league)
        }
        config.consecutiveHomeGamesMax = Number.parseInt(form.consecutiveHomeGamesMax)
        config.consecutiveHomeGamesMax = Number.isInteger(config.consecutiveHomeGamesMax) ? config.consecutiveHomeGamesMax : null
        config.consecutiveAwayGamesMax = Number.parseInt(form.consecutiveAwayGamesMax)
        config.consecutiveAwayGamesMax = Number.isInteger(config.consecutiveAwayGamesMax) ? config.consecutiveAwayGamesMax : null
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.consecutiveHomeGamesMaxEnabled && (form.consecutiveHomeGamesMax == null || (typeof form.consecutiveHomeGamesMax === 'string' && form.consecutiveHomeGamesMax.trim() == ''))) {
            let fc = this.leagueForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl
            fc.updateValue(false, { emitEvent: false })
        }
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.consecutiveAwayGamesMaxEnabled && (form.consecutiveAwayGamesMax == null || (typeof form.consecutiveAwayGamesMax === 'string' && form.consecutiveAwayGamesMax.trim() == ''))) {
            let fc = this.leagueForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl
            fc.updateValue(false, { emitEvent: false })
        }

        this.leagueService.updateLeague(this.league).then(() => {
            return this.leagueConfigService.addLeagueConfig(config)
        }).then(() => {
            this.editing = false
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes',
                'A database error occurred when saving the league. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        let fc = this.leagueForm.controls['name'] as FormControl
        fc.updateValue(this.league.name)
        if (this.league.leagueConfigPreLoaded) {
            fc = this.leagueForm.controls['consecutiveHomeGamesMax'] as FormControl
            fc.updateValue(this.league.leagueConfigPreLoaded.consecutiveHomeGamesMax)
            if (!this.listeners.consecutiveHomeGamesMax) {
                this.listeners.consecutiveHomeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.consecutiveHomeGamesMaxInput, this.leagueForm.controls['consecutiveHomeGamesMax'] as FormControl, this.leagueForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl)
                })
            }
            fc = this.leagueForm.controls['consecutiveAwayGamesMax'] as FormControl
            fc.updateValue(this.league.leagueConfigPreLoaded.consecutiveAwayGamesMax)
            if (!this.listeners.consecutiveAwayGamesMax) {
                this.listeners.consecutiveAwayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.consecutiveAwayGamesMaxInput, this.leagueForm.controls['consecutiveAwayGamesMax'] as FormControl, this.leagueForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl)
                })
            }
        }
        fc = this.leagueForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl
        fc.updateValue(this.league.leagueConfigPreLoaded && this.league.leagueConfigPreLoaded.consecutiveHomeGamesMax != null)
        if (!this.listeners.consecutiveHomeGamesMaxEnabled) {
            this.listeners.consecutiveHomeGamesMaxEnabled = fc.valueChanges.subscribe((evt) => {
                this.onConsecutiveHomeGamesMaxEnabledChange(evt)
            })
        }
        fc = this.leagueForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl
        fc.updateValue(this.league.leagueConfigPreLoaded && this.league.leagueConfigPreLoaded.consecutiveAwayGamesMax != null)
        if (!this.listeners.consecutiveAwayGamesMaxEnabled) {
            this.listeners.consecutiveAwayGamesMaxEnabled = fc.valueChanges.subscribe((evt) => {
                this.onConsecutiveAwayGamesMaxEnabledChange(evt)
            })
        }
    }

    private league: League
    private listeners: ListenerType = {} as ListenerType
}

interface ListenerType {
    consecutiveHomeGamesMax: Subscription,
    consecutiveHomeGamesMaxEnabled: Subscription,
    consecutiveAwayGamesMax: Subscription,
    consecutiveAwayGamesMaxEnabled: Subscription
}
