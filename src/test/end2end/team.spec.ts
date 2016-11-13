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
import { createTeam } from './helpers/team.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

/**
 * end-to-end test suite for team functions
 */
describe('team', function () {
    let app: any

    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    /**
     * Create a new team.
     *
     * A league is created, then a team is created.
     */
    it('create team', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let teamName = 'apple'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Teams"]')
        }).then(() => {
            return createTeam(client, teamName)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.getText('team-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(teamName)
            done()
        })
    }, 7000 * computerSpeed)

    /**
     * Delete a team.
     *
     * A league is created, then a team is created, then team is deleted.
     */
    it('delete team', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let teamName = 'apple'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Teams"]')
        }).then(() => {
            return createTeam(client, teamName)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.click(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Delete Team"]')
        }).then(() => {
            return client.click('[aria-label="Delete Team"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Confirm Delete Team"]')
        }).then(() => {
            return client.click('[aria-label="Confirm Delete Team"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create Team"]')
        }).then(() => {
            return client.isExisting('team-list-item')
        }).then((exists) => {
            expect(exists).toBe(false)
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Edit a team.
     *
     * A league is created, then a team is created, then the team is
     * edited, then saved, and then check if save persisted.
     */
    it('edit team', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let teamName = 'apple'
        let editName = 'banana'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Teams"]')
        }).then(() => {
            return createTeam(client, teamName)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.click(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Team"]')
        }).then(() => {
            return client.click('[aria-label="Edit Team"]')
        }).then(() => {
            return client.waitForVisible('input[aria-labelledby="teamName"]')
        }).then(() => {
            return client.setValue('input[aria-labelledby="teamName"]', editName)
        }).then(() => {
            return client.submitForm('input[aria-labelledby="teamName"]')
        }).then(() => {
            return client.waitForVisible('div[aria-labelledby="teamName"]')
        }).then(() => {
            return client.getText('div[aria-labelledby="teamName"]')
        }).then((text) => {
            expect(text).toBe(editName)
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Revert edits on a team.
     *
     * A league is created, then a team is created, then the team is
     * edited, then edits reverted, and then check if the original persisted.
     */
    it('revert team', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let teamName = 'apple'
        let editName = 'banana'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Teams"]')
        }).then(() => {
            return createTeam(client, teamName)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.click(`[aria-label="${teamName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Team"]')
        }).then(() => {
            return client.click('[aria-label="Edit Team"]')
        }).then(() => {
            return client.waitForVisible('input[aria-labelledby="teamName"]')
        }).then(() => {
            return client.setValue('input[aria-labelledby="teamName"]', editName)
        }).then(() => {
            return client.click('[aria-label="Revert"]')
        }).then(() => {
            return client.waitForVisible('div[aria-labelledby="teamName"]')
        }).then(() => {
            return client.getText('div[aria-labelledby="teamName"]')
        }).then((text) => {
            expect(text).toBe(teamName)
            done()
        })
    }, 8000 * computerSpeed)
})
