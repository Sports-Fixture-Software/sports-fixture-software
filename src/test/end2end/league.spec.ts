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

import { TestApp, computerSpeed } from '../init'
import { createLeague } from './helpers/league.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

/**
 * end-to-end test suite for league functions
 */
describe('league', function () {
    let app: any
    
    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    /**
     * Create a new league.
     */
    it('create first league', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        createLeague(client, leagueName).then(() => {
            return client.getText('league-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(leagueName)
            done()
        })
    }, 7000 * computerSpeed)

    /**
     * Delete a league.
     *
     * A league is created, then deleted.
     */
    it('delete league', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        createLeague(client, leagueName).then(() => {
            return client.getText('league-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(leagueName)
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Delete League"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Confirm Delete League"]')
        }).then(() => {
            return client.click('[aria-label="Confirm Delete League"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create League"]')
        }).then(() => {
            return client.isExisting('league-list-item')
        }).then((exists) => {
            expect(exists).toBe(false)    
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Edit a league.
     *
     * A league is created, then the league is edited, then saved, and then
     * check if save persisted.
     */
    it('edit league', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let editName = 'bravo'
        createLeague(client, leagueName).then(() => {
            return client.waitForVisible(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Edit League"]')
        }).then(() => {
            return client.setValue('input[aria-labelledby="leagueName"]', editName)
            }).then(() => {
            return client.submitForm('input[aria-labelledby="leagueName"]')
        }).then(() => {
            return client.waitForVisible('div[aria-labelledby="leagueName"]')
        }).then(() => {
            return client.getText('div[aria-labelledby="leagueName"]')
        }).then((text) => {
            expect(text).toBe(editName)
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Revert edits on a league.
     *
     * A league is created, then the league is edited, then edits reverted, and
     * then check if the original persisted.
     */
    it('revert league', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let editName = 'bravo'
        createLeague(client, leagueName).then(() => {
            return client.waitForVisible(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Edit League"]')
        }).then(() => {
            return client.setValue('input[aria-labelledby="leagueName"]', editName)
        }).then(() => {
            return client.click('[aria-label="Revert"]')
        }).then(() => {
            return client.waitForVisible('div[aria-labelledby="leagueName"]')
        }).then(() => {
            return client.getText('div[aria-labelledby="leagueName"]')
        }).then((text) => {
            expect(text).toBe(leagueName)
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Creates a 100 leagues.
     */
    it('create 100 leagues', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueNames: string[] = []
        let leagueNamePrefix = 'alpha'
        for (let i = 1; i <= 100; i++) {
            leagueNames.push(leagueNamePrefix + i)
        }

        client.waitForExist('[aria-label="Create League"]').then((found) => {
            return Promise.each(leagueNames, (item, index, length) => {
                return createLeague(client, item).then(() => {
                    return client.waitForVisible(`[aria-label="${item}"]`)
                })
            }) as any
        }).then(() => {
            done()
        })
    }, 25000 * computerSpeed)

})
