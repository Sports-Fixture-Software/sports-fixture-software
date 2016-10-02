import { Component, OnInit, ChangeDetectorRef, ViewChild, NgZone } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router } from '@angular/router'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { League } from '../models/league'
import { LeagueService } from '../services/league.service'
import { ButtonPopover } from './button_popover.component'
import { LeagueForm } from '../models/league.form'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league_details.template.html',
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES, POPOVER_DIRECTIVES]
})

export class LeagueDetailsComponent implements OnInit {
    constructor(private route: ActivatedRoute,
        private router: Router,
        private leagueService: LeagueService,
        private changeref: ChangeDetectorRef,
        private zone: NgZone) {
    }

    @ViewChild('saveChangesButton') saveChangesButton: ButtonPopover
    @ViewChild('deleteLeagueButton') deleteLeagueButton: ButtonPopover
    editing: boolean = false
    leagueForm: FormGroup

    ngOnInit() {
        this.leagueForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required]),
            consecutiveHomeGamesMaxEnabled: new FormControl(),
            consecutiveHomeGamesMax: new FormControl(),
            consecutiveAwayGamesMaxEnabled: new FormControl(),
            consecutiveAwayGamesMax: new FormControl()
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
