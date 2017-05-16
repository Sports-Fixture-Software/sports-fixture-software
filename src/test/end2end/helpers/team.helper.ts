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
 * end-to-end function to create a new team.
 * `name` is the team name.
 */
export function createTeam(client: webdriverio.Client<any>, name: string): webdriverio.Client<boolean> {
    return client.waitForVisible('[aria-label="Create Team"]').then(() => {
        return client.click('[aria-label="Create Team"]')
    }).then(() => {
        return client.waitForVisible('input[aria-label="Team Name"]')
    }).then(() => {
        return client.setValue('input[aria-label="Team Name"]', name)
    }).then(() => {
        return client.submitForm('input[aria-label="Team Name"]')
    }).then(() => {
        return client.waitForVisible('input[aria-label="Team Name"]', undefined, true)
    })
} 
