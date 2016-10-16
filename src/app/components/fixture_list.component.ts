import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { LeagueService } from '../services/league.service'
import { FixtureService } from '../services/fixture.service'
import { League } from '../models/league'
import { Fixture } from '../models/fixture'
import { FixtureForm } from '../models/fixture.form'
import { PopoverContent } from 'ng2-popover';
import { ButtonPopover } from './button_popover.component'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService, LeagueService],
    templateUrl: 'fixture_list.template.html'
})

export class FixtureListComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _leagueService: LeagueService,
        private _router: Router,
        private route: ActivatedRoute) {
    }
    @ViewChild('createFixtureButton') createFixtureButton: ButtonPopover
    @ViewChild('createFixturePopover') createFixturePopover: PopoverContent
    fixtureForm: FormGroup

    get fixtures(): Fixture[] { return this._fixtures }
    set fixtures(value: Fixture[]) { this._fixtures = value }
    get league(): League { return this._league }
    set league(value: League) { this._league = value }

    ngOnInit() {
        this.route.parent.params.subscribe((params: Params) => {
            let id = +params['id'];
            this._leagueService.getLeagueAndFixtures(id).then((l) => {
                this.league = l
                this.fixtures = l.fixturesPreLoaded.toArray()
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
