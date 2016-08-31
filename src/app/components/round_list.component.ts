import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { FixtureService } from '../services/fixture.service'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import * as moment from 'moment'
import * as electron from 'electron'

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
                    let runningDate = moment(f.startDate)
                    if (runningDate.day() == 0) { // 0 is Sunday
                        runningDate.subtract(1, 'day')
                    } else if (runningDate.day() < 6) { // 6 is Saturday
                        runningDate.add(6 - runningDate.day(), 'day')
                    }
                    for (let i = 1; i <= this.getNumberOfRounds(f.startDate, f.endDate); i++) {
                        if (i == 1) {
                            this.rounds.push(new Round({ number: i, startDate: f.startDate }))
                        } else {
                            runningDate.add(1, 'week')
                            this.rounds.push(new Round({ number: i, startDate: moment(runningDate) }))
                        }
                    }
                    this._changeref.detectChanges()
                })
            })
    }

    clicky() {
        let rounds = this.getNumberOfRounds(this.fixture.startDate, this.fixture.endDate)
        console.log(rounds)
        console.log(electron.remote.app.getLocale())
        console.log(navigator.language)
/*
        console.log('1:' + this.getNumberOfRounds(new Date(), new Date()) + ' = 0')
        console.log('2:'+this.getNumberOfRounds(new Date('2016-08-31'), new Date('2016-09-01')) + '=0')
        console.log('3:'+this.getNumberOfRounds(new Date('2016-08-31'), new Date('2016-09-03')) + '=1')
        console.log('4:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-03')) + '=1')
        console.log('5:'+this.getNumberOfRounds(new Date('2016-09-04'), new Date('2016-09-04')) + '=1')
        console.log('6:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-04')) + '=1')
        console.log('7:'+this.getNumberOfRounds(new Date('2016-09-02'), new Date('2016-09-04')) + '=1')
        console.log('8:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-04')) + '=1')
        console.log('9:'+this.getNumberOfRounds(new Date('2016-09-02'), new Date('2016-09-04')) + '=1')
        console.log('10:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-10')) + '=2')
        console.log('11:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-11')) + '=2')
        console.log('12:'+this.getNumberOfRounds(new Date('2016-09-04'), new Date('2016-09-10')) + '=2')
        console.log('13:'+this.getNumberOfRounds(new Date('2016-09-04'), new Date('2016-09-11')) + '=2')
        console.log('14:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-11')) + '=2')
        console.log('15:'+this.getNumberOfRounds(new Date('2016-09-03'), new Date('2016-09-24')) + '=4')*/
}

    navigateToFixture() {
        //this._router.navigate(['/fixture', fixture.id]);
    }

    private getNumberOfRounds(startDate: moment.Moment, endDate: Date): number {
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

    private rounds: Round[] = []
    private fixture: Fixture
}
