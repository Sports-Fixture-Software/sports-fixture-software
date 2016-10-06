import { DaysOfWeek } from './days_of_week'
import { Fixture } from '../models/fixture'
import { Round } from '../models/round'
import { Search } from './search'
import * as moment from 'moment'

export class DateTime {
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
    static getNumberOfRounds(startDate: moment.Moment, endDate: moment.Moment): number {
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

    /**
     * Fills in the "gaps" in rounds. The database may already have some rounds
     * because of entered constraints - constraints need a parent `Round`. Fill
     * in any gaps with new `Round`s.
     *
     * If `splice` is true, the gaps are inserted in `rounds` in-place.
     * If false, `rounds` is left untouched.
     *
     * Returns the new rounds inserted.
     */
    static fillInRounds(fixture: Fixture, rounds: Round[], splice: boolean): Round[] {
        let runningDate = moment(fixture.startDate)
        let newRounds: Round[] = []
        if (runningDate.day() == DaysOfWeek.Sunday) {
            runningDate.subtract(1, 'day')
        } else if (runningDate.day() < DaysOfWeek.Saturday) {
            runningDate.add(DaysOfWeek.Saturday - runningDate.day(), 'day')
        }
        for (let i = 1; i <= DateTime.getNumberOfRounds(fixture.startDate, fixture.endDate); i++) {
            let index = Search.binarySearch(rounds, i, (a: number, b: Round) => {
                return a - b.number
            })
            if (i > 1) {
                runningDate.add(1, 'week')
            }
            if (index < 0) {
                let round = new Round(i)
                if (i == 1) {
                    round.startDate = fixture.startDate
                } else {
                    round.startDate = runningDate
                }
                round.setFixture(fixture)
                if (splice) {
                    rounds.splice(~index, 0, round)
                }
                newRounds.push(round)
            }
        }
        return newRounds
    }
}
