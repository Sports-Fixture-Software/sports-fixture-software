import { TestApp, computerSpeed } from '../init'
import { createLeague } from './helpers/league.helper'
import { createFixture, editFixture } from './helpers/fixture.helper'
import { createTeam } from './helpers/team.helper'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

/**
 * end-to-end test suite for round functions
 */
describe('round', function () {
    let app: any

    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    /**
     * View round page with 0 rounds.
     *
     * A league is created, then a fixture is created, then view the rounds
     * page, and check for no rounds.
     */
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

    /**
     * View round page with 1 round.
     *
     * A league is created, then a fixture is created, then a fixture edited
     * with dates across a single weekend, then view the rounds page, and check
     * for 1 round, round number and round date.
     */
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

    /**
     * View round page with 23 round.
     *
     * A league is created, then a fixture is created, then a fixture edited
     * with dates across 23 rounds, then view the rounds page, and check
     * for 23 rounds, round number (for round 1 & round 23) and round date (for
     * round 1 & round 23).
     */
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

    /**
     * Add a reserve match-up.
     *
     * A league is created, then 4 teams are created, then a fixture is created,
     * then a fixture edited with dates across 23 rounds, then view the rounds
     * page, then add a reserve match-up, and check the match-up persisted.
     */
    it('add match-up', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '31082016'
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
            return client.selectByVisibleText('[aria-labelledby="homeTeam"]', teams[0])
        }).then(() => {
            return client.selectByVisibleText('[aria-labelledby="awayTeam"]', teams[1])
        }).then(() => {
            return client.click('[aria-label="Create Match-up"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create Match-up"]', undefined, true)
        }).then(() => {
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[1]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            done()
        })
    }, 10000 * computerSpeed)

    /**
     * Edit a reserve match-up.
     *
     * A league is created, then 4 teams are created, then a fixture is created,
     * then a fixture edited with dates across 23 rounds, then view the rounds
     * page, then add a reserve match-up, edit a reserve match-up, and check
     * the match-up persisted.
     */
    it('edit match-up', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '31082016'
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
            return client.selectByVisibleText('[aria-labelledby="homeTeam"]', teams[0])
        }).then(() => {
            return client.selectByVisibleText('[aria-labelledby="awayTeam"]', teams[1])
        }).then(() => {
            return client.click('[aria-label="Create Match-up"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create Match-up"]', undefined, true)
        }).then(() => {
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[1]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            return client.click(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Match-up"]')
        }).then(() => {
            return client.selectByVisibleText('[aria-labelledby="homeTeam"]', teams[2])
        }).then(() => {
            return client.click('[aria-label="Edit Match-up"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Edit Match-up"]', undefined, true)
        }).then(() => {
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[2]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[1]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            done()
        })
    }, 11000 * computerSpeed)

    /**
     * Delete a reserve match-up.
     *
     * A league is created, then 4 teams are created, then a fixture is created,
     * then a fixture edited with dates across 23 rounds, then view the rounds
     * page, then add a reserve match-up, and then delete the match-up.
     */
    it('delete match-up', (done) => {
        let client = app.client as webdriverio.Client<void>
        let leagueName = 'alpha'
        let fixtureName = 'hydrogen'
        let startDate = '24032016'
        let endDate = '31082016'
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
            return client.selectByVisibleText('[aria-labelledby="homeTeam"]', teams[0])
        }).then(() => {
            return client.selectByVisibleText('[aria-labelledby="awayTeam"]', teams[1])
        }).then(() => {
            return client.click('[aria-label="Create Match-up"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Create Match-up"]', undefined, true)
        }).then(() => {
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[1]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(true)
            return client.click(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then(() => {
            return client.waitForVisible('[aria-label="Delete Match-up"]')
        }).then(() => {
            return client.click('[aria-label="Delete Match-up"]')
        }).then(() => {
            return client.waitForVisible('[aria-label="Delete Match-up"]', undefined, true)
        }).then(() => {
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[0]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(false)
            return client.isVisible(`[aria-label="Round List Table"] > tbody tr:nth-of-type(1) > td > div:nth-of-type(1) > [aria-label="Edit ${teams[1]} Match-up"]`)
        }).then((visible) => {
            expect(visible).toBe(false)
            done()
        })
    }, 11000 * computerSpeed)

})
