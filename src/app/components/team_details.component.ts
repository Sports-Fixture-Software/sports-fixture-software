import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Team } from '../models/team'
import { TeamService } from '../services/team.service'
import { ButtonPopover } from './button_popover.component'
import { TeamForm } from '../models/team.form'
import { Subscription } from 'rxjs/Subscription'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_details.template.html',
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES]
})

export class TeamDetailsComponent implements OnInit {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private teamService: TeamService,
        private changeref: ChangeDetectorRef) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    editing: boolean = false
    teamForm: FormGroup

    ngOnInit() {
        this.teamForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
        })
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
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
    }

    private resetForm() {
    }

    private team: Team
}
