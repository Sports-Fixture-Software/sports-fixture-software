import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core'
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
    editing: boolean = false
    teamForm: FormGroup

    ngOnInit() {
        this.teamForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            homeGamesMin: new FormControl('', [<any>Validators.required]),
            homeGamesMax: new FormControl('', [<any>Validators.required]),
            homeGamesEnabled: new FormControl('', [<any>Validators.required]),
            awayGamesMin: new FormControl('', [<any>Validators.required]),
            awayGamesMax: new FormControl('', [<any>Validators.required]),
            awayGamesEnabled: new FormControl('', [<any>Validators.required]),
        })
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
            fc.updateValue(null, {emitEvent : false})
            fc = this.teamForm.controls['homeGamesMax'] as FormControl
            fc.updateValue(null, {emitEvent : false})
        }
    }

    /**
     *  If the user unchecks, clear the entered values
     */
    onAwayGamesEnabledChange(value: boolean) {
        if (!value) {
            let fc = this.teamForm.controls['awayGamesMin'] as FormControl
            fc.updateValue(null, {emitEvent : false})
            fc = this.teamForm.controls['awayGamesMax'] as FormControl
            fc.updateValue(null, {emitEvent : false})
        }
    }

    /**
     *  If the user enters a value, check the box to enable. If the user is
     *  entering a value, it is assumed they want enabled checked
     */
    onHomeGamesChange(value: string) {
        if (value) {
            let fc = this.teamForm.controls['homeGamesEnabled'] as FormControl
            fc.updateValue(true, {emitEvent : false})
        }
    }

    /**
     *  If the user enters a value, check the box to enable. If the user is
     *  entering a value, it is assumed they want enabled checked
     */
    onAwayGamesChange(value: string) {
        if (value) {
            let fc = this.teamForm.controls['awayGamesEnabled'] as FormControl
            fc.updateValue(true, {emitEvent : false})
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
            fc.updateValue(false, {emitEvent : false})
        }
        // if user checked the checkbox, but didn't enter a value, turn the
        // checked off
        if (form.awayGamesEnabled && (form.awayGamesMin == null || form.awayGamesMin == '') && (form.awayGamesMax == null || form.awayGamesMax == '')) {
            let fc = this.teamForm.controls['awayGamesEnabled'] as FormControl
            fc.updateValue(false, {emitEvent : false})
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
                    this.onHomeGamesChange(evt)
                })
            }
            fc = this.teamForm.controls['homeGamesMax'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.homeGamesMax)
            if (!this.listeners.homeGamesMax) {
                this.listeners.homeGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onHomeGamesChange(evt)
                })
            }
            fc = this.teamForm.controls['awayGamesMin'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.awayGamesMin)
            if (!this.listeners.awayGamesMin) {
                this.listeners.awayGamesMin = fc.valueChanges.subscribe((evt) => {
                    this.onAwayGamesChange(evt)
                })
            }
            fc = this.teamForm.controls['awayGamesMax'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.awayGamesMax)
            if (!this.listeners.awayGamesMax) {
                this.listeners.awayGamesMax = fc.valueChanges.subscribe((evt) => {
                    this.onAwayGamesChange(evt)
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

    private team: Team
    private listeners : listenerType = {} as listenerType
}

interface listenerType {
        homeGamesMin: Subscription,
        homeGamesMax: Subscription,
        homeGamesEnabled: Subscription,
        awayGamesMin: Subscription,
        awayGamesMax: Subscription,
        awayGamesEnabled: Subscription
}
