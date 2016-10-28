import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild, ElementRef, NgZone } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Team } from '../models/team'
import { TeamConfig } from '../models/team_config'
import { TeamService } from '../services/team.service'
import { TeamConfigService } from '../services/team_config.service'
import { ButtonPopover } from './button_popover.component'
import { InputPopover } from './input_popover.component'
import { TeamForm } from '../models/team.form'
import { Validator } from '../util/validator'
import { AppConfig } from '../util/app_config'
import { Subscription } from 'rxjs/Subscription'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_details.template.html',
    providers: [TeamService, TeamConfigService]
})

export class TeamDetailsComponent implements OnInit, OnDestroy {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private teamService: TeamService,
        private teamConfigService: TeamConfigService,
        private changeref: ChangeDetectorRef,
        private zone: NgZone) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    @ViewChild('deleteTeamButton') deleteTeamButton: ButtonPopover
    @ViewChild('homeGamesMinInput') homeGamesMinInput: InputPopover
    @ViewChild('homeGamesMaxInput') homeGamesMaxInput: InputPopover
    @ViewChild('awayGamesMinInput') awayGamesMinInput: InputPopover
    @ViewChild('awayGamesMaxInput') awayGamesMaxInput: InputPopover
    @ViewChild('consecutiveHomeGamesMaxInput') consecutiveHomeGamesMaxInput: InputPopover
    @ViewChild('consecutiveAwayGamesMaxInput') consecutiveAwayGamesMaxInput: InputPopover
    editing: boolean = false
    teamForm: FormGroup

    ngOnInit() {
        this.teamForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            homeGamesMin: new FormControl('', [Validator.integerGreaterEqualOrBlank(0)]),
            homeGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(0)]),
            homeGamesEnabled: new FormControl({ value: null, disabled: true }),
            awayGamesMin: new FormControl('', [Validator.integerGreaterEqualOrBlank(0)]),
            awayGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(0)]),
            awayGamesEnabled: new FormControl({ value: null, disabled: true }),
            consecutiveHomeGamesMaxEnabled: new FormControl({ value: null, disabled: true }),
            consecutiveHomeGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)]),
            consecutiveAwayGamesMaxEnabled: new FormControl({ value: null, disabled: true }),
            consecutiveAwayGamesMax: new FormControl('', [Validator.integerGreaterEqualOrBlank(Validator.CONSECUTIVE_GAMES_MIN)])
        })
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['team_id']
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
        this.routeSubscription.unsubscribe();
    }

    onEditTeam() {
        this.editing = true
        this.teamForm.get('homeGamesEnabled').enable()
        this.teamForm.get('awayGamesEnabled').enable()
        this.teamForm.get('consecutiveHomeGamesMaxEnabled').enable()
        this.teamForm.get('consecutiveAwayGamesMaxEnabled').enable()
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.teamForm.get('homeGamesEnabled').disable()
        this.teamForm.get('awayGamesEnabled').disable()
        this.teamForm.get('consecutiveHomeGamesMaxEnabled').disable()
        this.teamForm.get('consecutiveAwayGamesMaxEnabled').disable()
        this.resetForm()
        this.changeref.detectChanges()
    }

    onDeleteTeam() {
        this.teamService.deleteTeam(this.team).then(() => {
            this.zone.run(() => {
                this.router.navigate(['league'])
            })
        }).catch((err: Error) => {
            this.deleteTeamButton.showError('Error deleting team',
                'A database error occurred when deleting the team. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this.changeref.detectChanges()
        })
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onHomeGamesEnabledChange(value: boolean) {
        if (!value) {
            this.teamForm.patchValue({
                homeGamesMin: null,
                homeGamesMax: null
            })
        }
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onAwayGamesEnabledChange(value: boolean) {
        if (!value) {
            this.teamForm.patchValue({
                awayGamesMin: null,
                awayGamesMax: null
            })
        }
    }

    /**
     *  Show an error popover if invalid user entry.
     *  If the user enters a value, check the box to enable. If the user is
     *  entering a value, it is assumed they want enabled checked.
     */
    onFieldChange(value: any, element: InputPopover, control: FormControl, controlPair: FormControl, enableControl: FormControl) {
        // if value blank and the control's pair is blank, disable
        if (typeof value === 'string' && value.trim() == '' && typeof controlPair.value === 'string' && controlPair.value.trim() == '' && enableControl) {
            enableControl.patchValue(false, { emitEvent: false })
        } else if (value && enableControl) {
            // user entered a value, assume they want enabled
            enableControl.patchValue(true, { emitEvent: false })
        }
        if (element) {
            if (control.valid) {
                element.hideError()
            } else {
                element.showError('Please enter a number')
            }
        }
    }

    /**
     *  Show an error popover if invalid user entry.
     */
    onConsecutiveFieldChange(element: InputPopover, control: FormControl) {
        if (element) {
            if (control.valid) {
                element.hideError()
            }
            else {
                element.showError(`Please enter a number greater than ${Validator.CONSECUTIVE_GAMES_MIN - 1}`)
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
            this.teamForm.patchValue({ homeGamesEnabled: false });
        }
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.awayGamesEnabled && (form.awayGamesMin == null || form.awayGamesMin == '') && (form.awayGamesMax == null || form.awayGamesMax == '')) {
            this.teamForm.patchValue({ awayGamesEnabled: false });
        }
        if (form.consecutiveHomeGamesMaxEnabled) {
            if (form.consecutiveHomeGamesMax == null || (typeof form.consecutiveHomeGamesMax === 'string' && form.consecutiveHomeGamesMax.trim() == '')) {
                // if user checked the checkbox, but didn't enter a value, turn
                // the checked off
                this.teamForm.patchValue({ consecutiveHomeGamesMaxEnabled: false });
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
                this.teamForm.patchValue({ consecutiveAwayGamesMaxEnabled: false });
            }
            config.consecutiveAwayGamesMax = Number.parseInt(form.consecutiveAwayGamesMax)
            config.consecutiveAwayGamesMax = Number.isInteger(config.consecutiveAwayGamesMax) ? config.consecutiveAwayGamesMax : null
        } else {
            config.consecutiveAwayGamesMax = null
        }

        this.teamService.addTeam(this.team).then(() => {
            return this.teamConfigService.addTeamConfig(config)
        }).then(() => {
            this.editing = false
            this.teamForm.get('homeGamesEnabled').disable()
            this.teamForm.get('awayGamesEnabled').disable()
            this.teamForm.get('consecutiveHomeGamesMaxEnabled').disable()
            this.teamForm.get('consecutiveAwayGamesMaxEnabled').disable()
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes',
                'A database error occurred when saving the team. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        this.teamForm.patchValue({
            name: this.team.name,
            homeGamesEnabled: this.team.teamConfigPreLoaded && (this.team.teamConfigPreLoaded.homeGamesMin != null || this.team.teamConfigPreLoaded.homeGamesMax != null),
            awayGamesEnabled: this.team.teamConfigPreLoaded && (this.team.teamConfigPreLoaded.awayGamesMin != null || this.team.teamConfigPreLoaded.awayGamesMax != null),
            consecutiveHomeGamesMax: this.team.teamConfigPreLoaded.consecutiveHomeGamesMax,
            consecutiveAwayGamesMax: this.team.teamConfigPreLoaded.consecutiveAwayGamesMax,
            consecutiveHomeGamesMaxEnabled: this.team.teamConfigPreLoaded && this.team.teamConfigPreLoaded.consecutiveHomeGamesMax != null,
            consecutiveAwayGamesMaxEnabled: this.team.teamConfigPreLoaded && this.team.teamConfigPreLoaded.consecutiveAwayGamesMax != null
        })
        if (this.team.teamConfigPreLoaded) {
            this.teamForm.patchValue({
                homeGamesMin: this.team.teamConfigPreLoaded.homeGamesMin,
                homeGamesMax: this.team.teamConfigPreLoaded.homeGamesMax,
                awayGamesMin: this.team.teamConfigPreLoaded.awayGamesMin,
                awayGamesMax: this.team.teamConfigPreLoaded.awayGamesMax
            })

            if (!this.listeners.homeGamesMin) {
                let fc = this.teamForm.controls['homeGamesMin'] as FormControl                
                this.listeners.homeGamesMin = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.homeGamesMinInput, this.teamForm.controls['homeGamesMin'] as FormControl,
                        this.teamForm.controls['homeGamesMax'] as FormControl, this.teamForm.controls['homeGamesEnabled'] as FormControl)
                })
            }
            if (!this.listeners.homeGamesMax) {
                let fc = this.teamForm.controls['homeGamesMax'] as FormControl                
                this.listeners.homeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.homeGamesMaxInput, this.teamForm.controls['homeGamesMax'] as FormControl,
                        this.teamForm.controls['homeGamesMin'] as FormControl, this.teamForm.controls['homeGamesEnabled'] as FormControl)
                })
            }
            if (!this.listeners.awayGamesMin) {
                let fc = this.teamForm.controls['awayGamesMin'] as FormControl                
                this.listeners.awayGamesMin = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.awayGamesMinInput, this.teamForm.controls['awayGamesMin'] as FormControl, this.teamForm.controls['awayGamesMax'] as FormControl, this.teamForm.controls['awayGamesEnabled'] as FormControl)
                })
            }
            if (!this.listeners.awayGamesMax) {
                let fc = this.teamForm.controls['awayGamesMax'] as FormControl                
                this.listeners.awayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onFieldChange(evt, this.awayGamesMaxInput, this.teamForm.controls['awayGamesMax'] as FormControl,
                        this.teamForm.controls['awayGamesMin'] as FormControl, this.teamForm.controls['awayGamesEnabled'] as FormControl)
                })
            }
            if (!this.listeners.consecutiveHomeGamesMax) {
                let fc = this.teamForm.controls['consecutiveHomeGamesMax'] as FormControl
                this.listeners.consecutiveHomeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onConsecutiveFieldChange(this.consecutiveHomeGamesMaxInput, this.teamForm.controls['consecutiveHomeGamesMax'] as FormControl)
                })
            }
            if (!this.listeners.consecutiveAwayGamesMax) {
                let fc = this.teamForm.controls['consecutiveAwayGamesMax'] as FormControl
                this.listeners.consecutiveAwayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onConsecutiveFieldChange(this.consecutiveAwayGamesMaxInput, this.teamForm.controls['consecutiveAwayGamesMax'] as FormControl)
                })
            }
        }

        if (!this.listeners.homeGamesEnabled) {
            let fc = this.teamForm.controls['homeGamesEnabled'] as FormControl            
            this.listeners.homeGamesEnabled = fc.valueChanges.subscribe((evt) => {
                this.onHomeGamesEnabledChange(evt)
            })
        }
        if (!this.listeners.awayGamesEnabled) {
            let fc = this.teamForm.controls['awayGamesEnabled'] as FormControl        
            this.listeners.awayGamesEnabled = fc.valueChanges.subscribe((evt) => {
                this.onAwayGamesEnabledChange(evt)
            })
        }
    }

    private team: Team
    private listeners: ListenerType = {} as ListenerType
    private routeSubscription: Subscription
}

interface ListenerType {
    homeGamesMin: Subscription,
    homeGamesMax: Subscription,
    homeGamesEnabled: Subscription,
    awayGamesMin: Subscription,
    awayGamesMax: Subscription,
    awayGamesEnabled: Subscription
    consecutiveHomeGamesMax: Subscription,
    consecutiveAwayGamesMax: Subscription
}
