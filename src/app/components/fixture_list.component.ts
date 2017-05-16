/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { Subscription } from 'rxjs/Subscription';
import { LeagueService } from '../services/league.service'
import { FixtureService } from '../services/fixture.service'
import { League } from '../models/league'
import { Fixture } from '../models/fixture'
import { FixtureForm } from '../models/fixture.form'
import { AppConfig } from '../util/app_config'
import { PopoverContent } from 'ng2-popover';
import { ButtonPopover } from './button_popover.component'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService, LeagueService],
    templateUrl: 'fixture_list.template.html'
})

export class FixtureListComponent implements OnInit, OnDestroy {
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
        this.routeSubscription = this.route.parent.params.subscribe((params: Params) => {
            let id = +params['id'];
            this._leagueService.getLeagueAndFixtures(id).then((l) => {
                this.league = l
                this.fixtures = l.fixturesPreLoaded.toArray()
                this._changeref.detectChanges()
            })
            this.fixtureForm = new FormGroup({
                name: new FormControl('', [<any>Validators.required]),
                description: new FormControl('')
            })
        })
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    createFixture(form: FixtureForm) {
        let fixture: Fixture = new Fixture()
        fixture.name = form.name
        fixture.description = form.description
        fixture.setLeague(this.league)
        this._fixtureService.addFixture(fixture).then((f) => {
            this.fixtures.push(fixture)
            this.createFixturePopover.hide()
            this.resetForm()
            this._changeref.detectChanges()
        }).catch((err: Error) => {
            this.createFixtureButton.showError('Error creating fixture',
                'A database error occurred when creating the fixture. ' + AppConfig.DatabaseErrorGuidance)
            AppConfig.log(err)
            this._changeref.detectChanges()
        })
    }

    navigateToFixture(fixture: Fixture) {
        this._router.navigate(['/fixture', fixture.id]);
    }

    private resetForm() {
        this.fixtureForm.patchValue({
            name: null,
            description: null
        })
    }

    private _fixtures: Fixture[]
    private _league: League
    private routeSubscription: Subscription
}
