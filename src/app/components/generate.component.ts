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

import { Component, OnInit, OnDestroy, ChangeDetectorRef, Output, ViewChild, EventEmitter } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router'
import { Subscription } from 'rxjs/Subscription';
import { ButtonPopover } from './button_popover.component'
import { Fixture } from '../models/fixture'
import { League } from '../models/league'
import { FixtureService } from '../services/fixture.service'
import { TeamService } from '../services/team.service'
import { NotifyService, GenerateState } from '../services/notify.service'
import { RoundService } from '../services/round.service'
import { MatchService } from '../services/match.service'
import { SchedulerService } from '../services/scheduler/scheduler.service'
import { Collection } from '../services/collection'
import { DateTime } from '../util/date_time'
import { AppConfig } from '../util/app_config'
import * as moment from 'moment'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'generate.template.html',
    // RoundService, MatchService not used in this file, but needs to be
    // 'provided' before SchedulerService is used
    providers: [FixtureService, TeamService, SchedulerService, RoundService, MatchService]
})

export class GenerateComponent implements OnInit, OnDestroy {

    constructor(private fixtureService: FixtureService,
        private teamService: TeamService,
        private notifyService: NotifyService,
        private schedulerService: SchedulerService,
        private changeref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router) {
    }

    @ViewChild('generateButton') generateButton: ButtonPopover

    ngOnInit() {
        this.routeSubscription = this.route.parent.params.subscribe((params: Params) => {
            let id = +params['id']
            this.fixtureService.getFixtureAndLeague(id).then(fixture => {
                this.fixture = fixture
                this.numberOfRounds = DateTime.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate)
                this.league = fixture.leaguePreLoaded
                return this.teamService.countTeams(this.league)
            }).then((res) => {
                this.numberOfTeams = res
                let timeLimit = this.numberOfTeams*this.numberOfRounds*6;
                this.minutesLimit = Math.floor((timeLimit/60)%60);
                this.changeref.detectChanges()
            })
        })
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }

    generate() {
        if (this.fixture) {
            this.notifyService.emitGenerateState(GenerateState.Generating)
            this.fixture.generatedOn = moment()
            this.generating = true
            this.fixtureService.updateFixture(this.fixture).then(() => {
                return this.schedulerService.generateFixture(this.fixture)
            }).then(() => {
                this.notifyService.emitGenerateState(GenerateState.Generated)
                this.generating = false
                this.changeref.detectChanges()
            }).catch((err: Error) => {
                if (err.message && err.message.toUpperCase().indexOf('SQL') > 0) {
                    this.generateButton.showError('Error generating fixture',
                        'A database error occurred when generating the fixture. ' + AppConfig.DatabaseErrorGuidance)
                } else {
                    this.generateButton.showError('Error generating fixture', err.message)
                }
                AppConfig.log(err)
                this.generating = false
                this.changeref.detectChanges()
            })
        }
    }

    cancel() {
        this.schedulerService.generateCancel()
        this.generating = false
        this.changeref.detectChanges()
    }

    private generating: boolean = false
    private numberOfTeams: number
    private numberOfRounds: number
    private minutesLimit: number;
    private league: League
    private fixture: Fixture
    private routeSubscription: Subscription;
}
