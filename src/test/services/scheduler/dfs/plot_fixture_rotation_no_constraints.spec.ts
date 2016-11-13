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

import { plotFixtureRotation } from '../../../../app/services/scheduler/dfs/plot_fixture_rotation';
import { Match } from '../../../../app/services/scheduler/dfs/fixture_constraints';
import { TestUtil } from './helpers/test_util'
import { TeamConstraints } from '../../../../app/services/scheduler/dfs/team_constraints'

describe('services DFS scheduler plot fixture rotation, no constraints', () => {
    let timeout: number = 30000 // each test has 30 seconds
    afterEach(() => {
        if (TestUtil.worker) {
            TestUtil.worker.kill()
        }
    })

    it('invalid, 0 teams', () => {
        let reservedMatches: Match[] = []
        let testTeams: TeamConstraints[] = []
        expect(() => {
            plotFixtureRotation(testTeams, reservedMatches, 1, true)
        }).toThrowError('At least two teams are required to make a fixture.')
    })

    it('invalid, 1 teams', () => {
        let reservedMatches: Match[] = []
        let testTeams: TeamConstraints[] = [
            new TeamConstraints(0, {maxHome: -1, maxAway: -1}, {consecutiveHomeGamesMax: -1, consecutiveAwayGamesMax: -1})
        ]
        expect(() => {
            plotFixtureRotation(testTeams, reservedMatches, 1, true)
        }).toThrowError('At least two teams are required to make a fixture.')
    })

    it('2 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 2
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 3 teams', () => {
        let reservedMatches: Match[] = []
        let testTeams: TeamConstraints[] = [
            new TeamConstraints(0, {maxHome: -1, maxAway: -1}, {consecutiveHomeGamesMax: -1, consecutiveAwayGamesMax: -1}),
            new TeamConstraints(1, {maxHome: -1, maxAway: -1}, {consecutiveHomeGamesMax: -1, consecutiveAwayGamesMax: -1}),
            new TeamConstraints(2, {maxHome: -1, maxAway: -1}, {consecutiveHomeGamesMax: -1, consecutiveAwayGamesMax: -1}),
        ]
        expect(() => {
            plotFixtureRotation(testTeams, reservedMatches, 2, true)
        }).toThrowError('Odd number of teams in the teams parameter. Add a bye to make it even.')
    })

    it('4 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('6 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('8 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('10 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('12 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('14 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('16 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 16
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('18 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 18
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('20 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 20
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('22 teams, no constraints', (done) => {
        let reservedMatches: Match[] = []
        let numTeams = 22
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

})
