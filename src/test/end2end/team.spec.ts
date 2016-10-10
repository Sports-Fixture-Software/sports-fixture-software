import { TestApp, computerSpeed } from '../init'
import { createLeague } from './helpers/league.helper'
import { createTeam } from './helpers/team.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

describe('team', function () {
    let app: any
    
    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

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
})
