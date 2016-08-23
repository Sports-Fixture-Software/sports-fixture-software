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

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService, LeagueService],
    templateUrl: 'fixture_list.template.html',
    directives: [FixtureListItem, REACTIVE_FORM_DIRECTIVES, POPOVER_DIRECTIVES]
})

export class FixtureListComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _leagueService: LeagueService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }
    @ViewChild('errorPopover') errorPopover: PopoverContent
    @ViewChild('createFixturePopover') createFixturePopover: PopoverContent
    fixtureForm: FormGroup

    get fixtures(): Fixture[] { return this._fixtures }
    set fixtures(value: Fixture[]) { this._fixtures = value }
    get league(): League { return this._league }
    set league(value: League) { this._league = value }
    get lastError(): Error { return this._error }
    set lastError(value: Error) { this._error = value }

    ngOnInit() {
        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._leagueService.getLeague(id).then((l) => {
                    this.league = l
                    return l.getFixtures()
                }).then((f) => {
                    this.fixtures = f.toArray()
                    this._changeref.detectChanges()
                })
                this.fixtureForm = new FormGroup({
                    name: new FormControl('', [<any>Validators.required]),
                    description: new FormControl('', [<any>Validators.required]),
                    startDate: new FormControl('', [<any>Validators.required]),
                    endDate: new FormControl('', [<any>Validators.required])
                })
            })
    }

    createFixture(form: FixtureForm) {
        let fixture: Fixture = new Fixture()
        fixture.name = form.name
        fixture.description = form.description
        fixture.startDate = form.startDate
        fixture.endDate = form.endDate
        fixture.setLeague(this.league)
        this._fixtureService.addFixture(fixture).then((f) => {
            this.fixtures.push(fixture)
            this.createFixturePopover.hide()
            this._changeref.detectChanges()
        }).catch((err) => {
            this.lastError = err
            // .hide() works around a bug where: if user clicks the create
            // button twice, the popup moves around. The popup still moves but
            // not as much
            this.errorPopover.hide()
            this.errorPopover.show()
            this._changeref.detectChanges()
        })
    }

    private _fixtures: Fixture[]
    private _league: League
    private _error: Error
}
