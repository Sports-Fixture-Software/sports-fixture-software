import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { League } from '../models/league'
import { LeagueService } from '../services/league.service'
import { ButtonPopover } from './button_popover.component'
import { LeagueForm } from '../models/league.form'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league_details.template.html',
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES]
})

export class LeagueDetailsComponent implements OnInit {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private leagueService: LeagueService,
        private changeref: ChangeDetectorRef) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    editing: boolean = false
    leagueForm: FormGroup

    ngOnInit() {
        this.leagueForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
        })
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.leagueService.getLeague(id).then(league => {
                    this.league = league
                    this.resetForm()
                    this.changeref.detectChanges()
                })
            })
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

    updateLeague(form: LeagueForm) {
        this.league.name = form.name
        this.leagueService.updateLeague(this.league).then(() => {
            this.editing = false
            this.changeref.detectChanges()
        }).catch((err: Error) => {
            this.saveChangesButton.showError('Error saving changes', err.message)
            this.changeref.detectChanges()
        })
    }

    private resetForm() {
        let fc = this.leagueForm.controls['name'] as FormControl
        fc.updateValue(this.league.name)
    }

    private league: League
}
