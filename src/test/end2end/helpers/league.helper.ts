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

import * as webdriverio from 'webdriverio'

/**
 * end-to-end function to create a new league.
 * `name` is the league name.
 */
export function createLeague(client: webdriverio.Client<any>, name: string): webdriverio.Client<boolean> {
    return client.waitForExist('[aria-label="Create League"]').then((found) => {
        expect(found).toBe(true)
        return client.click('[aria-label="Create League"]')
    }).then((res) => {
        return client.isVisible('input[aria-label="League Name"]')
    }).then((exists) => {
        expect(exists).toBe(true)
        return client.setValue('input[aria-label="League Name"]', name)
    }).then(() => {
        return client.submitForm('input[aria-label="League Name"]')
    }).then(() => {
        return client.waitForVisible('input[aria-label="League Name"]', undefined, true)
    })
}
