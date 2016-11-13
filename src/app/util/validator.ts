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

import { FormControl, FormGroup } from '@angular/forms'
export class Validator {

    /**
     * Validator to ensure an integer is greater than the `target` number
     * provided, or blank.
     */
    static integerGreaterEqualOrBlank = (target: number) => {
        return (control: FormControl): { [key: string]: any } => {
            if (control.value == null) {
                return null
            }
            if (typeof control.value === 'string' && control.value.trim() == '') {
                return null
            }
            let num = Number(control.value)
            if (Number.isNaN(num)) {
                return { NaN: true }
            }
            if (!Number.isInteger(num)) {
                return { NotInteger: true }
            }
            if (num < target) {
                return { NotGreater: true }
            }
            return null
        }
    }

    /**
     * Validator to ensure different teams are selected. Can't reserve a
     * match-up of teamX vs teamX
     */
    static differentTeamsSelected = ({value}: FormGroup): { [key: string]: any } => {
        return new Promise(resolve => {
            if (value.homeTeam == value.awayTeam) {
                resolve({equal: true})
            } else {
                resolve(null);
            }
        })
    }
    /**
     * Minimum number allowed for consecutive home/ away games constraint
     */
    static CONSECUTIVE_GAMES_MIN: number = 2
}
