import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { League } from '../models/league'
import { LeagueConfig } from '../models/league_config'
import { LeagueService } from '../services/league.service'
import { LeagueConfigService } from '../services/league_config.service'
import { ButtonPopover } from './button_popover.component'
import { InputPopover } from './input_popover.component'
import { LeagueForm } from '../models/league.form'
import { Validator } from '../util/validator'
import { PopoverContent } from 'ng2-popover'
import { Subscription } from 'rxjs/Subscription'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league_details.template.html',
    providers: [LeagueService, LeagueConfigService]
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
            consecutiveHomeGamesMaxEnabled: new FormControl({value: null, disabled: true}),
            consecutiveHomeGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)]),
            consecutiveAwayGamesMaxEnabled: new FormControl({value: null, disabled: true}),
            consecutiveAwayGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)])
        })
        this.routeSubscription = this.route.parent.params.subscribe(params => {
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
        this.routeSubscription.unsubscribe();
    }

    onEditLeague() {
        this.editing = true
        this.leagueForm.get('consecutiveHomeGamesMaxEnabled').enable()
        this.leagueForm.get('consecutiveAwayGamesMaxEnabled').enable()
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.leagueForm.get('consecutiveHomeGamesMaxEnabled').disable()   
        this.leagueForm.get('consecutiveAwayGamesMaxEnabled').disable()             
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
                err.message)
            this.changeref.detectChanges()
        })
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onConsecutiveHomeGamesMaxEnabledChange(value: boolean) {
        if (!value) {
            this.leagueForm.patchValue({consecutiveHomeGamesMax: null});
        }
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onConsecutiveAwayGamesMaxEnabledChange(value: boolean) {
        if (!value) {
            this.leagueForm.patchValue({consecutiveAwayGamesMax: null});
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
            enableControl.patchValue(false, { emitEvent: false })
        } else if (value && enableControl) {
            // user entered a value, assume they want enabled
            enableControl.patchValue(true, { emitEvent: false })
        }
        if (element) {
            if (control.valid) {
                element.hideError()
            } else {
                element.showError(`Please enter a number greater than ${Validator.CONSECUTIVE_GAMES_MIN-1}`)
            }
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
            this.leagueForm.patchValue({consecutiveHomeGamesMaxEnabled: false});
        }
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.consecutiveAwayGamesMaxEnabled && (form.consecutiveAwayGamesMax == null || (typeof form.consecutiveAwayGamesMax === 'string' && form.consecutiveAwayGamesMax.trim() == ''))) {
            this.leagueForm.patchValue({consecutiveAwayGamesMaxEnabled: false});            
        }

        this.leagueService.updateLeague(this.league).then(() => {
            return this.leagueConfigService.addLeagueConfig(config)
        }).then(() => {
            this.editing = false
            this.leagueForm.get('consecutiveHomeGamesMaxEnabled').disable()   
            this.leagueForm.get('consecutiveAwayGamesMaxEnabled').disable()
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes', err.message)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        this.leagueForm.patchValue({
            name: this.league.name,
            consecutiveHomeGamesMaxEnabled: this.league.leagueConfigPreLoaded && this.league.leagueConfigPreLoaded.consecutiveHomeGamesMax != null,
            consecutiveAwayGamesMaxEnabled: this.league.leagueConfigPreLoaded && this.league.leagueConfigPreLoaded.consecutiveAwayGamesMax != null
        });

        if (this.league.leagueConfigPreLoaded) {
            this.leagueForm.patchValue({
                consecutiveHomeGamesMax: this.league.leagueConfigPreLoaded.consecutiveHomeGamesMax,
                consecutiveAwayGamesMax: this.league.leagueConfigPreLoaded.consecutiveAwayGamesMax
            })

            if (!this.listeners.consecutiveHomeGamesMax) {
                let fc = this.leagueForm.controls['consecutiveHomeGamesMax'] as FormControl                
                this.listeners.consecutiveHomeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.consecutiveHomeGamesMaxInput, this.leagueForm.controls['consecutiveHomeGamesMax'] as FormControl, this.leagueForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl)
                })
            }
            if (!this.listeners.consecutiveAwayGamesMax) {
                let fc = this.leagueForm.controls['consecutiveAwayGamesMax'] as FormControl                
                this.listeners.consecutiveAwayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.consecutiveAwayGamesMaxInput, this.leagueForm.controls['consecutiveAwayGamesMax'] as FormControl, this.leagueForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl)
                })
            }
        }
        if (!this.listeners.consecutiveHomeGamesMaxEnabled) {
            let fc = this.leagueForm.controls['consecutiveHomeGamesMaxEnabled'] as FormControl            
            this.listeners.consecutiveHomeGamesMaxEnabled = fc.valueChanges.subscribe((evt) => {
                this.onConsecutiveHomeGamesMaxEnabledChange(evt)
            })
        }
        if (!this.listeners.consecutiveAwayGamesMaxEnabled) {
            let fc = this.leagueForm.controls['consecutiveAwayGamesMaxEnabled'] as FormControl            
            this.listeners.consecutiveAwayGamesMaxEnabled = fc.valueChanges.subscribe((evt) => {
                this.onConsecutiveAwayGamesMaxEnabledChange(evt)
            })
        }
    }

    private league: League
    private listeners: ListenerType = {} as ListenerType
    private routeSubscription: Subscription
}

interface ListenerType {
    consecutiveHomeGamesMax: Subscription,
    consecutiveHomeGamesMaxEnabled: Subscription,
    consecutiveAwayGamesMax: Subscription,
    consecutiveAwayGamesMaxEnabled: Subscription
}
