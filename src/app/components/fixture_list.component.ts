import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { Validators } from '@angular/common'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { LeagueService } from '../services/league.service'
import { FixtureService } from '../services/fixture.service'
import { League } from '../models/league'
import { Fixture } from '../models/fixture'
import { FixtureForm } from '../models/fixture.form'
import { FixtureListItem } from './fixture_list_item.component'
import { POPOVER_DIRECTIVES, PopoverContent } from 'ng2-popover';
import { ButtonPopover } from './button_popover.component'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService, LeagueService],
    templateUrl: 'fixture_list.template.html',
    directives: [FixtureListItem, ButtonPopover, REACTIVE_FORM_DIRECTIVES, POPOVER_DIRECTIVES]
})

export class FixtureListComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _leagueService: LeagueService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }
    @ViewChild('createFixtureButton') createFixtureButton: ButtonPopover
    @ViewChild('createFixturePopover') createFixturePopover: PopoverContent
    fixtureForm: FormGroup

    get fixtures(): Fixture[] { return this._fixtures }
    set fixtures(value: Fixture[]) { this._fixtures = value }
    get league(): League { return this._league }
    set league(value: League) { this._league = value }

    ngOnInit() {
        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._leagueService.getLeague(id).then((l) => {
                    this.league = l
                    return this._fixtureService.getFixtures(l)
                }).then((f) => {
                    this.fixtures = f.toArray()
                    this._changeref.detectChanges()
                })
                this.fixtureForm = new FormGroup({
                    name: new FormControl('', [<any>Validators.required]),
                    description: new FormControl('', [<any>Validators.required])
                })
            })
    }

    createFixture(form: FixtureForm) {
        let fixture: Fixture = new Fixture()
        fixture.name = form.name
        fixture.description = form.description
        fixture.setLeague(this.league)
        this._fixtureService.addFixture(fixture).then((f) => {
            this.fixtures.push(fixture)
            this.createFixturePopover.hide()
            this._changeref.detectChanges()
        }).catch((err: Error) => {
            this.createFixtureButton.showError('Error creating fixture', err.message)
            this._changeref.detectChanges()
        })
    }

    navigateToFixture(fixture: Fixture) {
        this._router.navigate(['/fixture', fixture.id]);
    }

    private _fixtures: Fixture[]
    private _league: League
}
