import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { FixtureService } from '../services/fixture.service'
import { League } from '../models/league'
import { Fixture } from '../models/fixture'
import { FixtureForm } from '../models/fixture.form'
import { LeaguePresenter } from '../presenters/league.presenter'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    directives: [REACTIVE_FORM_DIRECTIVES],
    providers: [FixtureService],
    templateUrl: 'fixture_list.template.html'
})

export class FixtureListComponent implements OnInit {
    constructor(private _fixtureService: FixtureService,
        private _leaguePresenter: LeaguePresenter) {
    }
    activeLeage: League
    fixtureForm: FormGroup

    ngOnInit() {
        this.activeLeage = this._leaguePresenter.activeLeague
        this.fixtureForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required])
        })
    }

    createFixture(form: FixtureForm) {
        let fixture: Fixture = new Fixture()
        fixture.name = form.name
        fixture.setLeague(this.activeLeage)
        this._fixtureService.addFixture(fixture)
    }
}
