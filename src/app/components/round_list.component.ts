import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FixtureService } from '../services/fixture.service'
import { Fixture } from '../models/fixture'
import * as moment from 'moment'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService],
    templateUrl: 'round_list.template.html'
})

export class RoundListComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }

    ngOnInit() {
        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._fixtureService.getFixture(id).then((f) => {
                    this.fixture = f
                })
            })
        this.getNumberOfRounds(null, null)
    }

    clicky() {
        let rounds = this.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate)
        console.log(rounds)
    }

    navigateToFixture() {
        //this._router.navigate(['/fixture', fixture.id]);
    }

    private getNumberOfRounds(startDate: Date, endDate: Date): number {
        let start = moment(startDate)
        let end = moment(endDate)
        if (start.day() == 0) { // 0 is Sunday
            start.subtract(1, 'day')
        } else if (start.day() < 6) { // 6 is Saturday
            start.add(6 - start.day(), 'day')
        }
        if (end.day() < 6) {
            end.subtract(end.day() + 1, 'day')
        }
        let daysdiff = end.diff(start, 'days')
        if (daysdiff < 0) {
            return 0
        } else if (daysdiff == 0) {
            return 1
        } else {
            return Math.round(daysdiff / 7) + 1
        }
    }

    private fixture: Fixture
}
