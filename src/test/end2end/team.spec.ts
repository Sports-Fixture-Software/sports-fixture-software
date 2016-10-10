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
