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
import { createFixture, editFixture } from './helpers/fixture.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

/**
 * end-to-end test suite for fixture functions
 */
describe('fixture', () => {
    let app: any

    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    /**
     * Create a new fixture.
     *
     * A league is created, then a fixture is created. The optional description
     * is left blank.
     */
    it('create fixture (no description)', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Fixtures"]')
        }).then(() => {
            return createFixture(client, fixtureName)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.getText('fixture-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(fixtureName)
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Create a new fixture.
     *
     * A league is created, then a fixture is created. The optional description
     * is completed.
     */
    it('create fixture (with description)', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let fixtureDescription = 'hydrogen fixture description'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Fixtures"]')
        }).then(() => {
            return createFixture(client, fixtureName, fixtureDescription)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.getText('fixture-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(fixtureName)
        }).then(() => {
            return client.click(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Fixture Form"]')
        }).then(() => {
            return client.getText('div[aria-labelledby="fixtureName"]')
        }).then((text) => {
            expect(text).toBe(fixtureName)
            return client.getText('div[aria-labelledby="fixtureDescription"]')
        }).then((text) => {
            expect(text).toBe(fixtureDescription)
            done()
        })
    }, 8000 * computerSpeed)

    /**
     * Delete a fixture.
     *
     * A league is created, then a fixture is created, then fixture is deleted.
     */
    it('delete fixture', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let fixtureDescription = 'hydrogen fixture description'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Fixtures"]')
        }).then(() => {
            return createFixture(client, fixtureName, fixtureDescription)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.getText('fixture-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(fixtureName)
        }).then(() => {
            return client.click(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Fixture Form"]')
        }).then(() => {
            return client.click('[aria-label="Delete Fixture"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Confirm Delete Fixture"]')
        }).then(() => {
            return client.click('[aria-label="Confirm Delete Fixture"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create Fixture"]')
        }).then(() => {
            return client.isExisting('fixture-list-item')
        }).then((exists) => {
            expect(exists).toBe(false)
            done()
        })
    }, 9000 * computerSpeed)

    /**
     * Edit a fixture.
     *
     * A league is created, then a fixture is created, then the fixture is
     * edited, then saved, and then check if save persisted. The optional
     * description is completed.
     */
    it('edit fixture (with description)', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let fixtureDescription = 'hydrogen fixture description'
        let editName = 'bravo'
        let editDescription = 'helium fixture description'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Fixtures"]')
        }).then(() => {
            return createFixture(client, fixtureName, fixtureDescription)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.getText('fixture-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(fixtureName)
            return client.click(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return editFixture(client, editName, editDescription)
        }).then(() => {
            return client.getText('div[aria-labelledby="fixtureName"]')
        }).then((text) => {
            expect(text).toBe(editName)
            return client.getText('div[aria-labelledby="fixtureDescription"]')
        }).then((text) => {
            expect(text).toBe(editDescription)
            done()
        })
    }, 9000 * computerSpeed)

    /**
     * Revert edits on a fixture.
     *
     * A league is created, then a fixture is created, then the fixture is
     * edited, then edits reverted, and then check if the original persisted.
     */
    it('revert fixture', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let fixtureDescription = 'hydrogen fixture description'
        let editName = 'bravo'
        let editDescription = 'helium fixture description'
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Fixtures"]')
        }).then(() => {
            return createFixture(client, fixtureName, fixtureDescription)
        }).then(() => {
            return client.waitForVisible(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.getText('fixture-list-item')
        }).then((text) => {
            // check for only 1 match:
            //   (getText returns a string if only 1 match)     
            expect(text).toEqual(jasmine.any(String))
            expect(text).toBe(fixtureName)
        }).then(() => {
            return client.click(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Fixture Form"]')
        }).then(() => {
            return client.click('[aria-label="Edit Fixture"]')
        }).then(() => {
            return client.waitForVisible('input[aria-labelledby="fixtureName"]')
        }).then(() => {
            return client.setValue('input[aria-labelledby="fixtureName"]', editName)
        }).then(() => {
            return client.setValue('input[aria-labelledby="fixtureDescription"]', editDescription)
        }).then(() => {
            return client.click('[aria-label="Revert"]')
        }).then(() => {
            return client.waitForVisible('div[aria-labelledby="fixtureName"]')
        }).then(() => {
            return client.getText('div[aria-labelledby="fixtureName"]')
        }).then((text) => {
            expect(text).toBe(fixtureName)
            return client.getText('div[aria-labelledby="fixtureDescription"]')
        }).then((text) => {
            expect(text).toBe(fixtureDescription)
            done()
        })
    }, 9000 * computerSpeed)
})
