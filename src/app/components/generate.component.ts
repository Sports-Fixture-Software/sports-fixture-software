import { Component, OnInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Fixture } from '../models/fixture'
import { League } from '../models/league'
import { FixtureService } from '../services/fixture.service'
import { TeamService } from '../services/team.service'
import { NotifyService } from '../services/notify.service'
import { RoundService } from '../services/round.service'
import { MatchService } from '../services/match.service'
import { SchedulerService } from '../services/scheduler.service'
import { Collection }  from '../services/collection'
import { DateTime } from '../util/date_time'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'generate.template.html',
    // RoundService, MatchService not used in this file, but needs to be
    // 'provided' before SchedulerService is used
    providers: [FixtureService, TeamService, SchedulerService, RoundService, MatchService],
    directives: []
})

export class GenerateComponent implements OnInit {

    constructor(private fixtureService: FixtureService,
        private teamService: TeamService,
        private notifyService: NotifyService,
        private schedulerService: SchedulerService,
        private changeref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.fixtureService.getFixtureAndLeague(id).then(fixture => {
                    this.fixture = fixture
                    this.numberOfRounds = DateTime.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate)
                    this.league = fixture.leaguePreLoaded
                    return this.teamService.countTeams(this.league)
                }).then((res) => {
                    this.numberOfTeams = res
                    this.changeref.detectChanges()
                })
            })
    }

    generate() {
        if (this.fixture) {
            this.fixture.generatedOn = new Date()
            this.fixtureService.updateFixture(this.fixture)
            this.notifyService.emitGenerated(true)
            this.schedulerService.generateFixture(this.fixture)
        }
    }

    private numberOfTeams: number
    private numberOfRounds: number
    private league: League
    private fixture: Fixture
}
