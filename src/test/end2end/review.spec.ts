import { TestApp, computerSpeed } from '../init'
import { createLeague } from './helpers/league.helper'
import { createFixture, editFixture } from './helpers/fixture.helper'
import { createTeam } from './helpers/team.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

describe('review', function () {
    let app: any

    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    it('review', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '11042016'
        let teams = ['Adelaide', 'Central', 'Glenelg', 'North']
        let headers: string[]
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
            return client.click('[aria-label="Review"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Review Matches Table"] > tbody > tr')
        }).then(() => {
            // table has 3 rounds
            return client.elements('[aria-label="Review Matches Table"] > tbody > tr')
        }).then((res) => {
            expect(res.value.length).toBe(3, 'table rows')
            return client.getText('[aria-label="Review Matches Table"] > thead > tr > th')
        }).then((res) => {
            if (typeof res == 'string') {
                headers = [res as string]
            } else {
                headers = res as string[]
            }
            expect(headers.length).toBeGreaterThan(0, 'table headers not found')
            let index = headers.indexOf('Round')
            expect(index).toBeGreaterThan(-1, 'column "Round" not found')
            // get the table cell in row 1, column "Round":
            return client.getText(`[aria-label="Review Matches Table"] > tbody tr:nth-of-type(1) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('1', 'column "Round"')
            let index = headers.indexOf('Date')
            expect(index).toBeGreaterThan(-1, 'column "Date" not found')
            return client.getText(`[aria-label="Review Matches Table"] > tbody tr:nth-of-type(1) > td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('Mar 24, 2016', 'column "Date"')
            let index = headers.indexOf('Matches')
            expect(index).toBeGreaterThan(-1, 'column "Matches" not found')
            return client.elements(`[aria-label="Review Matches Table"] > tbody tr:nth-of-type(1) > td:nth-of-type(${index + 1}) > div`)
        }).then((res) => {
            expect(res.value.length).toBe(2, 'number of matches')
            done()
        })
    }, 20000 * computerSpeed)

    it('review and edit', (done) => {
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
            return client.click('[aria-label="Review"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Fixture"]')
        }).then(() => {
            return client.click('[aria-label="Edit Fixture"]')
        }).then(() => {
            return client.waitForVisible(`[aria-label="Review Matches Table"] > tbody > tr:nth-of-type(1) [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then(() => {
            return client.click(`[aria-label="Review Matches Table"] > tbody > tr:nth-of-type(1) [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Match-up"]')
        }).then(() => {
            return client.selectByVisibleText('[aria-labelledby="homeTeam"]', teams[1])
        }).then(() => {
            return client.selectByVisibleText('[aria-labelledby="awayTeam"]', teams[2])
        }).then(() => {
            return client.click('[aria-label="Edit Match-up"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Match-up"]', undefined, true)
        }).then(() => {
            return client.isVisible(`[aria-label="Review Matches Table"] > tbody > tr:nth-of-type(1) [aria-label="Edit ${teams[1]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true, 'home team after edit')
            return client.isVisible(`[aria-label="Review Matches Table"] > tbody > tr:nth-of-type(1) [aria-label="Edit ${teams[2]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true, 'away team after edit')
            done()
        })
    }, 20000 * computerSpeed)

})
