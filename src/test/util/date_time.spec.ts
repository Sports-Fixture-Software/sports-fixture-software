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
