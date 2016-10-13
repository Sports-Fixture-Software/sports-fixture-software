import { TestApp, computerSpeed } from '../init'
import { createLeague } from './helpers/league.helper'
import { createFixture, editFixture } from './helpers/fixture.helper'
import { createTeam } from './helpers/team.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

/**
 * end-to-end test suite for generate fixture functions
 */
describe('generate', function () {
    let app: any

    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    /**
     * Generate a fixture.
     *
     * A league is created, then 4 teams are created, then a fixture created,
     * then the fixture is edited, then a fixture is generated.
     */
    it('generate for 3 rounds, 4 teams', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '11042016'
        let teams = ['Adelaide', 'Central', 'Glenelg', 'North']
        createLeague(client, leagueName).then(() => {
            return client.click(`[aria-label="${leagueName}"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit League Form"]')
        }).then(() => {
            return client.click('[aria-label="Teams"]')
        }).then(() => {
            return Promise.each(teams, (item, index, len) => {
                return createTeam(client, item)
            }) as any
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
            return client.waitForVisible('[aria-label="Generate"]')
        }).then(() => {
            return client.click('[aria-label="Generate"]')
        }).then(() => {
            return client.waitForVisible('h2[aria-label="Summary"] ~ [aria-label="Generate"]')
        }).then(() => {
            return client.click('h2[aria-label="Summary"] ~ [aria-label="Generate"]')
        }).then(() => {
            // wait until review button not disabled (class disabled)    
            return client.waitUntil(() => {
                return client.isExisting('.disabled[aria-label="Review"]').then((exists) => {
                    return !exists
                })
            }, 10000)
        }).then(() => {
            done()
        })
    }, 20000 * computerSpeed)

})
