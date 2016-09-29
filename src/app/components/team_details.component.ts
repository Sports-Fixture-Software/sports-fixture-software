import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Team } from '../models/team'
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

export class TeamDetailsComponent implements OnInit {
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

    onEditTeam() {
        this.editing = true
        this.changeref.detectChanges()
    }

    onRevert() {
        this.editing = false
        this.resetForm()
        this.changeref.detectChanges()
    }

    updateTeam(form: TeamForm) {
        this.team.name = form.name
        this.teamService.addTeam(this.team).then((f) => {
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
            fc = this.teamForm.controls['homeGamesMax'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.homeGamesMax)
            fc = this.teamForm.controls['awayGamesMin'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.awayGamesMin)
            fc = this.teamForm.controls['awayGamesMax'] as FormControl
            fc.updateValue(this.team.teamConfigPreLoaded.awayGamesMax)
        }
    }

    private team: Team
}
