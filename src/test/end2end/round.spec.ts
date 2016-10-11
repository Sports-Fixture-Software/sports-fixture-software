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
            return client.elements('[aria-label="Round List Table"] > tbody tr')
        }).then((res) => {
            expect(res.value.length).toBe(0)
            done()
        })
    }, 8000 * computerSpeed)

    it('1 round', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '10102016'
        let endDate = '15102016'
        let headers: string[]
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
            return client.waitForVisible('[aria-label="Round List Table"] > tbody > tr')
        }).then(() => {
            // table has 1 round    
            return client.elements('[aria-label="Round List Table"] > tbody > tr')
        }).then((res) => {
            expect(res.value.length).toBe(1, 'table rows')
            return client.getText('[aria-label="Round List Table"] > thead > tr > th')
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
            return client.getText(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('1', 'column "Round"')
            let index = headers.indexOf('Date')
            expect(index).toBeGreaterThan(-1, 'column "Date" not found')
            return client.getText(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('Oct 10, 2016', 'column "Date"')
            done()
        })
    }, 8000 * computerSpeed)

    it('23 round', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '31082016'
        let headers: string[]
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
            return client.waitForVisible('[aria-label="Round List Table"] > tbody > tr')
        }).then(() => {
            // table rows
            return client.elements('[aria-label="Round List Table"] > tbody > tr')
        }).then((res) => {
            expect(res.value.length).toBe(23, 'table rows')
            return client.getText('[aria-label="Round List Table"] > thead > tr > th')
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
            return client.getText(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('1', 'column "Round"')
            let index = headers.indexOf('Date')
            expect(index).toBeGreaterThan(-1, 'column "Date" not found')
            return client.getText(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('Mar 24, 2016', 'column "Date"')
            let index = headers.indexOf('Round')
            expect(index).toBeGreaterThan(-1, 'column "Round" not found')
            // get the table cell in row 1, column "Round":
            return client.getText(`[aria-label="Round List Table"] > tbody tr:nth-of-type(23) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('23', 'column "Round"')
            let index = headers.indexOf('Date')
            expect(index).toBeGreaterThan(-1, 'column "Date" not found')
            return client.getText(`[aria-label="Round List Table"] > tbody tr:nth-of-type(23) td:nth-of-type(${index + 1})`)
        }).then((res) => {
            expect(res).toBe('Aug 27, 2016', 'column "Date"')
            done()
        })
    }, 8000 * computerSpeed)

    it('add match-up', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '31082016'
        let headers: string[]
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
            return client.waitForVisible('[aria-label="Round List Table"] > tbody > tr')
        }).then(() => {
            // table rows
            return client.elements('[aria-label="Round List Table"] > tbody > tr')
        }).then((res) => {
            expect(res.value.length).toBe(23, 'table rows')
            return client.moveToObject('[aria-label="Round List Table"] > tbody tr:nth-of-type(1)')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create Match-up for Round 1"]')
        }).then(() => {
            return client.click('[aria-label="Create Match-up for Round 1"]')
        }).then(() => {
            return client.waitForVisible('[aria-labelledby="homeTeam"]')
        }).then(() => {
            done()
        })
    }, 8000 * computerSpeed)
})
