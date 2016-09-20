import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Fixture } from '../models/fixture'
import { League } from '../models/league'
import { FixtureService } from '../services/fixture.service'
import { TeamService } from '../services/team.service'
import { Collection }  from '../services/collection'
import { DateTime } from '../util/date_time'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'generate.template.html',
    providers: [FixtureService, TeamService],
    directives: []
})

export class GenerateComponent implements OnInit {

    constructor(private fixtureService: FixtureService,
        private teamService: TeamService,
        private changeref: ChangeDetectorRef,
        private route: ActivatedRoute,
        private router: Router) {
    }

    ngOnInit() {
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.fixtureService.getFixture(id).then(fixture => {
                    this.fixture = fixture
                    this.numberOfRounds = DateTime.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate)
                    return fixture.getLeague()
                }).then((league) => {
                    this.league = league
                    return this.teamService.countTeams(league)
                }).then((res) => {
                    this.numberOfTeams = res
                    this.changeref.detectChanges()
                })
            })
    }

    generate() {
    }

    private numberOfTeams: number
    private numberOfRounds: number
    private league: League
    private fixture: Fixture
}
