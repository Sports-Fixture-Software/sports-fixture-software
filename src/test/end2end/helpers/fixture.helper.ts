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
 * end-to-end function to create a new fixture.
 * `name` is the fixture name.
 * `description` (optional).
 */
export function createFixture(client: webdriverio.Client<any>, name: string, description?: string): webdriverio.Client<boolean> {
    return client.waitForVisible('[aria-label="Create Fixture"]').then(() => {
        return client.click('[aria-label="Create Fixture"]')
    }).then(() => {
        return client.waitForVisible('input[aria-labelledby="fixtureName"]')
    }).then(() => {
        return client.setValue('input[aria-labelledby="fixtureName"]', name)
    }).then(() => {
        if (description) {
            return client.setValue('input[aria-labelledby="fixtureDescription"]', description)
        }
    }).then(() => {
        return client.submitForm('input[aria-labelledby="fixtureName"]')
    }).then(() => {
        return client.waitForVisible('input[aria-labelledby="fixtureName"]', undefined, true)
    })
} 

/**
 * end-to-end function to edit a fixture.
 * `name` is the fixture name (optional).
 * `description` (optional)
 * `startDate` is a string as user would type in a date <input>. eg 28032016
 * `endDate` is a string as user would type in a date <input>. eg 28032016
 */
export function editFixture(client: webdriverio.Client<any>, name?: string, description?: string, startDate?: string, endDate?: string): webdriverio.Client<boolean> {
    return client.waitForVisible('[aria-label="Edit Fixture"]').then(() => {
        return client.click('[aria-label="Edit Fixture"]')
    }).then(() => {
        return client.waitForVisible('input[aria-labelledby="fixtureName"]')
    }).then(() => {
        if (name) {
            return client.setValue('input[aria-labelledby="fixtureName"]', name)
        }
    }).then(() => {
        if (description) {
            return client.setValue('input[aria-labelledby="fixtureDescription"]', description)
        }
    }).then(() => {
        if (startDate) {
            return client.click('input[aria-labelledby="startDate"]').then(() => {
                return client.keys(startDate)
            })
        }
    }).then(() => {
        if (endDate) {
            return client.click('input[aria-labelledby="endDate"]').then(() => {
                return client.keys(endDate)
            })
        }
    }).then(() => {
        return client.submitForm('input[aria-labelledby="fixtureName"]')
    }).then(() => {
        return client.waitForVisible('div[aria-labelledby="fixtureName"]')
    })
}
