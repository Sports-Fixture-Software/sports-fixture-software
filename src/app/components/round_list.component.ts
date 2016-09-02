import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core'
import { ActivatedRoute, Router, Params } from '@angular/router';
import { REACTIVE_FORM_DIRECTIVES, FormGroup, FormControl, FormBuilder } from '@angular/forms'
import { Validators } from '@angular/common'

import { FixtureService } from '../services/fixture.service'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import { DaysOfWeek } from '../util/days_of_week'
import { ButtonPopover } from './button_popover.component'
import * as moment from 'moment'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    providers: [FixtureService],
    directives: [ButtonPopover, REACTIVE_FORM_DIRECTIVES],
    templateUrl: 'round_list.template.html'
})

export class RoundListComponent implements OnInit {
    constructor(private _changeref: ChangeDetectorRef,
        private _fixtureService: FixtureService,
        private _router: Router,
        private _route: ActivatedRoute) {
    }

    matchupForm: FormGroup

    ngOnInit() {
        this.matchupForm = new FormGroup({
            name: new FormControl('', [<any>Validators.required])
        })

        this.setPopupsToHideWhenClickOutside()

        this._router.routerState.parent(this._route)
            .params.forEach(params => {
                let id = +params['id'];
                this._fixtureService.getFixture(id).then((f) => {
                    this.fixture = f
                    let runningDate = moment(f.startDate)
                    if (runningDate.day() == DaysOfWeek.Sunday) {
                        runningDate.subtract(1, 'day')
                    } else if (runningDate.day() < DaysOfWeek.Saturday) {
                        runningDate.add(DaysOfWeek.Saturday - runningDate.day(), 'day')
                    }
                    for (let i = 1; i <= this.getNumberOfRounds(f.startDate, f.endDate); i++) {
                        if (i == 1) {
                            this.rounds.push(new Round({ number: i, startDate: f.startDate }))
                        } else {
                            runningDate.add(1, 'week')
                            this.rounds.push(new Round({ number: i, startDate: moment(runningDate).toDate() }))
                        }
                    }
                    this._changeref.detectChanges()
                })
            })
    }

    onDataBound() {
        if (!this.initComplete) {
            jQuery('.add-matchup-button').popover
                ({
                    html: true, content: jQuery('#matchupForm')
                })
            this.initComplete = true
        }
    }

    createMatchup(form: any) {
        console.log(form)
    }

    /**
     * http://stackoverflow.com/a/14857326
     */
    setPopupsToHideWhenClickOutside() {
        jQuery(document).on('click', function (e) {
            jQuery('[data-toggle="popover"],[data-original-title]').each(function () {
                //the 'is' for buttons that trigger popups
                //the 'has' for icons within a button that triggers a popup
                if (!jQuery(this).is(e.target) && jQuery(this).has(e.target).length === 0 && jQuery('.popover').has(e.target).length === 0) {
                    ((jQuery(this).popover('hide').data('bs.popover') || {}).inState || {}).click = false  // fix for BS 3.3.6
                }
            })
        })
    }

    /**
     * Return the number of rounds between two dates.
     * 
     * The `startDate` can be any day of the week. If `startDate` is a weekend,
     * the round count will include that weekend, otherwise count starts at
     * next weekend. 
     * 
     * The `endDate` can be any day of the week. If `endDate` is a weekend, the
     * round count will include that weekend, otherwise count ends at the
     * previous weekend.
     * 
     * If both `startDate` and `endDate` are mid-week in the same week, the
     * returned round count will be 0.
     * 
     * If both `startDate` and `endDate` are on the weeked in the same week, the
     * returned round count will be 1.
     * 
     * If `startDate` is later than `endDate`, returned round count will be 0.
     */
    private getNumberOfRounds(startDate: Date, endDate: Date): number {
        let start = moment(startDate)
        let end = moment(endDate)
        if (start.day() == DaysOfWeek.Sunday) {
            start.subtract(1, 'day')
        } else if (start.day() < DaysOfWeek.Saturday) {
            start.add(DaysOfWeek.Saturday - start.day(), 'day')
        }
        if (end.day() < DaysOfWeek.Saturday) {
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

    private initComplete: boolean = false
    private rounds: Round[] = []
    private fixture: Fixture
}
