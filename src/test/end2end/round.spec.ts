import { TestApp, computerSpeed } from '../init'
import { createLeague } from './helpers/league.helper'
import { createFixture, editFixture } from './helpers/fixture.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

describe('round', function () {
    let app: any
    
    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    it('no rounds (no fixture dates)', (done) => {
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
            return client.click(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return client.waitForVisible(`[aria-label="Rounds"]`)
        }).then(() => {
            return client.click(`[aria-label="Rounds"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Round List Table"]')
        }).then(() => {
            // table has no rows    
            return client.elements('[aria-label="Round List Table"] > tr')
        }).then((res) => {
            expect(res.value.length).toBe(0)
            done()
        })
    }, 8000 * computerSpeed)

    it('no teams', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '10102016'
        let endDate = '15102016'
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
            return client.click(`[aria-label="${fixtureName}"]`)
        }).then(() => {
            return editFixture(client, undefined, undefined, startDate, endDate)
        }).then(() => {
            return client.waitForVisible(`[aria-label="Rounds"]`)
        }).then(() => {
            return client.click(`[aria-label="Rounds"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Round List Table"]')
        }).then(() => {
            // table has 1 round    
            return client.elements('[aria-label="Round List Table"] > tr')
        }).then((res) => {
            expect(res.value.length).toBe(1)
            done()
        })
    }, 8000 * computerSpeed)
})
