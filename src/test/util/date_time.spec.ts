import { DateTime } from '../../app/util/date_time'
import * as moment from 'moment'

/**
 * Unit tests for the util DateTime
 */
describe('util DateTime', () => {

    it('0 rounds, mid week 1', () => {
        expect(DateTime.getNumberOfRounds(
            moment('20-10-2016', 'DD-MM-YYYY'),
            moment('20-10-2016', 'DD-MM-YYYY'),
        )).toBe(0)
    })

    it('0 rounds, mid week 2', () => {
        expect(DateTime.getNumberOfRounds(
            moment('17-10-2016', 'DD-MM-YYYY'),
            moment('21-10-2016', 'DD-MM-YYYY'),
        )).toBe(0)
    })

    it('1 rounds, sat to sat', () => {
        expect(DateTime.getNumberOfRounds(
            moment('22-10-2016', 'DD-MM-YYYY'),
            moment('22-10-2016', 'DD-MM-YYYY'),
        )).toBe(1)
    })

    it('1 rounds, sat to sun', () => {
        expect(DateTime.getNumberOfRounds(
            moment('22-10-2016', 'DD-MM-YYYY'),
            moment('22-10-2016', 'DD-MM-YYYY'),
        )).toBe(1)
    })

    it('1 rounds, sat to fri', () => {
        expect(DateTime.getNumberOfRounds(
            moment('22-10-2016', 'DD-MM-YYYY'),
            moment('28-10-2016', 'DD-MM-YYYY'),
        )).toBe(1)
    })

    it('1 rounds, mon to fri', () => {
        expect(DateTime.getNumberOfRounds(
            moment('18-10-2016', 'DD-MM-YYYY'),
            moment('28-10-2016', 'DD-MM-YYYY'),
        )).toBe(1)
    })

    it('2 rounds, mon to mon', () => {
        expect(DateTime.getNumberOfRounds(
            moment('10-10-2016', 'DD-MM-YYYY'),
            moment('24-10-2016', 'DD-MM-YYYY'),
        )).toBe(2)
    })

    it('2 rounds, sat to sat', () => {
        expect(DateTime.getNumberOfRounds(
            moment('15-10-2016', 'DD-MM-YYYY'),
            moment('22-10-2016', 'DD-MM-YYYY'),
        )).toBe(2)
    })

    it('2 rounds, sat to sun', () => {
        expect(DateTime.getNumberOfRounds(
            moment('15-10-2016', 'DD-MM-YYYY'),
            moment('23-10-2016', 'DD-MM-YYYY'),
        )).toBe(2)
    })

    it('2 rounds, mon to fri', () => {
        expect(DateTime.getNumberOfRounds(
            moment('26-09-2016', 'DD-MM-YYYY'),
            moment('14-10-2016', 'DD-MM-YYYY'),
        )).toBe(2)
    })

})
