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
import { Team } from '../../../../app/util/scheduler/team'

describe('services DFS scheduler plot fixture rotation, reserved matches', () => {
    let timeout: number = 30000 // each test has 30 seconds
    afterEach(() => {
        if (TestUtil.worker) {
            TestUtil.worker.kill()
        }
    })

    it('2 teams, reserved matches, combo 1', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 1)
        ]
        let numTeams = 2
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('2 teams, reserved matches, combo 2', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 1, 0)
        ]
        let numTeams = 2
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('4 teams, reserved matches, all round 0 reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 1),
            new Match(0, 2, 3)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('4 teams, reserved matches, last round reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(2, 3, 1),
            new Match(2, 2, 0)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('4 teams, reserved matches, reserved matches scattered, unordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(2, 2, 1),
            new Match(1, 2, 0),
            new Match(0, 0, 3)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('4 teams, reserved matches, reserved matches scattered, ordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 3),
            new Match(1, 2, 0),
            new Match(2, 2, 1)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('4 teams, reserved matches, first and last rounds all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 3),
            new Match(0, 2, 1),
            new Match(2, 3, 1),
            new Match(2, 1, 2)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('4 teams, reserved matches, all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 3),
            new Match(0, 2, 1),
            new Match(1, 1, 3),
            new Match(1, 0, 2),
            new Match(2, 1, 0),
            new Match(2, 3, 2)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 4 teams, reserved matches, team 0 plays twice in round 2', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 3),
            new Match(0, 2, 1),
            new Match(1, 1, 3),
            new Match(1, 0, 2),
            new Match(2, 1, 0),
            new Match(2, 3, 0)
        ]
        let numTeams = 4
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((res) => {
            done.fail('Expected to throw Error')
        }).catch((err: Error) => {
            expect(err.message).toBe('Reserved Matches clash with basic constraints in this rotation.')
            done()
        })
    }, timeout)

    it('6 teams, reserved matches, all round 0 reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 5, 1),
            new Match(0, 2, 0),
            new Match(0, 4, 3)
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('6 teams, reserved matches, last round reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(4, 0, 1),
            new Match(4, 5, 2),
            new Match(4, 3, 4)
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('6 teams, reserved matches, reserved matches scattered, unordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(2, 2, 1),
            new Match(1, 2, 0),
            new Match(4, 5, 3),
            new Match(3, 2, 3),
            new Match(0, 4, 5)
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('6 teams, reserved matches, reserved matches scattered, ordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 3),
            new Match(1, 2, 0),
            new Match(2, 2, 1),
            new Match(3, 5, 1),
            new Match(4, 4, 0)
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('6 teams, reserved matches, first and last rounds all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 3),
            new Match(0, 2, 1),
            new Match(0, 4, 5),
            new Match(4, 3, 5),
            new Match(4, 4, 1),
            new Match(4, 0, 2)
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('6 teams, reserved matches, all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 4, 3),
            new Match(0, 5, 2),
            new Match(0, 1, 0),
            new Match(1, 0, 5),
            new Match(1, 3, 2),
            new Match(1, 1, 4),
            new Match(2, 3, 5),
            new Match(2, 1, 2),
            new Match(2, 4, 0),
            new Match(3, 3, 0),
            new Match(3, 5, 1),
            new Match(3, 2, 4),
            new Match(4, 1, 3),
            new Match(4, 4, 5),
            new Match(4, 0, 2),
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 6 teams, reserved matches, team 5 plays twice in round 4', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 4, 3),
            new Match(0, 5, 2),
            new Match(0, 1, 0),
            new Match(1, 0, 5),
            new Match(1, 3, 2),
            new Match(1, 1, 4),
            new Match(2, 3, 5),
            new Match(2, 1, 2),
            new Match(2, 4, 0),
            new Match(3, 3, 0),
            new Match(3, 5, 1),
            new Match(3, 2, 4),
            new Match(4, 1, 3),
            new Match(4, 4, 5),
            new Match(4, 5, 2),
        ]
        let numTeams = 6
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            done.fail('Expected to throw Error')
        }).catch((err: Error) => {
            expect(err.message).toBe('Reserved Matches clash with basic constraints in this rotation.')
            done()
        })
    }, timeout)

    it('8 teams, reserved matches, all round 0 reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 1, 4),
            new Match(0, 5, 2),
            new Match(0, 3, 6),
            new Match(0, 0, 7),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('8 teams, reserved matches, last round reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(6, 0, 3),
            new Match(6, 2, 6),
            new Match(6, 7, 5),
            new Match(6, 4, 1),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('8 teams, reserved matches, reserved matches scattered, unordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(3, 3, 1),
            new Match(6, 0, 5),
            new Match(0, 2, 4),
            new Match(5, 7, 6),
            new Match(4, 2, 5),
            new Match(1, 4, 0),
            new Match(2, 1, 3),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('8 teams, reserved matches, reserved matches scattered, ordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 2, 0),
            new Match(1, 3, 2),
            new Match(2, 7, 5),
            new Match(3, 6, 1),
            new Match(4, 4, 0),
            new Match(5, 6, 7),
            new Match(6, 3, 1),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('8 teams, reserved matches, first and last rounds all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 5, 6),
            new Match(0, 4, 1),
            new Match(0, 7, 3),
            new Match(0, 2, 0),
            new Match(6, 3, 2),
            new Match(6, 7, 5),
            new Match(6, 6, 1),
            new Match(6, 4, 0),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('8 teams, reserved matches, all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 2, 0),
            new Match(0, 3, 5),
            new Match(0, 6, 7),
            new Match(0, 1, 4),
            new Match(1, 0, 5),
            new Match(1, 1, 6),
            new Match(1, 3, 7),
            new Match(1, 4, 2),
            new Match(2, 6, 0),
            new Match(2, 7, 1),
            new Match(2, 4, 3),
            new Match(2, 2, 5),
            new Match(3, 1, 5),
            new Match(3, 4, 6),
            new Match(3, 0, 3),
            new Match(3, 7, 2),
            new Match(4, 0, 1),
            new Match(4, 7, 4),
            new Match(4, 5, 6),
            new Match(4, 2, 3),
            new Match(5, 0, 4),
            new Match(5, 6, 2),
            new Match(5, 1, 3),
            new Match(5, 7, 5),
            new Match(6, 2, 1),
            new Match(6, 0, 7),
            new Match(6, 6, 3),
            new Match(6, 4, 5),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 8 teams, reserved matches, team 1 plays twice in round 1', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 5, 2),
            new Match(0, 6, 7),
            new Match(0, 3, 4),
            new Match(0, 1, 0),
            new Match(1, 1, 2),
            new Match(1, 3, 7),
            new Match(1, 6, 4),
            new Match(1, 5, 1),
            new Match(2, 3, 5),
            new Match(2, 6, 1),
            new Match(2, 2, 0),
            new Match(2, 4, 7),
            new Match(3, 1, 3),
            new Match(3, 6, 5),
            new Match(3, 7, 2),
            new Match(3, 4, 0),
            new Match(4, 3, 2),
            new Match(4, 4, 5),
            new Match(4, 1, 7),
            new Match(4, 6, 0),
            new Match(5, 4, 1),
            new Match(5, 0, 3),
            new Match(5, 7, 5),
            new Match(5, 6, 2),
            new Match(6, 6, 3),
            new Match(6, 4, 2),
            new Match(6, 1, 5),
            new Match(6, 7, 0),
        ]
        let numTeams = 8
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            done.fail('Expected to throw Error')
        }).catch((err: Error) => {
            expect(err.message).toBe('Reserved Matches clash with basic constraints in this rotation.')
            done()
        })
    }, timeout)

    it('10 teams, reserved matches, all round 0 reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 1, 3),
            new Match(0, 4, 2),
            new Match(0, 5, 9),
            new Match(0, 6, 7),
            new Match(0, 0, 8),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('10 teams, reserved matches, last round reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(8, 8, 1),
            new Match(8, 0, 4),
            new Match(8, 7, 5),
            new Match(8, 3, 9),
            new Match(8, 2, 6),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('10 teams, reserved matches, reserved matches scattered, unordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(8, 6, 7),
            new Match(5, 5, 6),
            new Match(3, 3, 9),
            new Match(0, 4, 1),
            new Match(7, 5, 4),
            new Match(6, 9, 1),
            new Match(4, 5, 7),
            new Match(2, 3, 4),
            new Match(1, 6, 2),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('10 teams, reserved matches, reserved matches scattered, ordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 5, 6),
            new Match(1, 2, 6),
            new Match(2, 1, 4),
            new Match(3, 3, 0),
            new Match(4, 6, 9),
            new Match(5, 8, 0),
            new Match(6, 1, 7),
            new Match(7, 9, 0),
            new Match(8, 4, 8),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('10 teams, reserved matches, first and last rounds all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 6, 1),
            new Match(0, 2, 5),
            new Match(0, 4, 7),
            new Match(0, 0, 8),
            new Match(0, 3, 9),
            new Match(8, 4, 6),
            new Match(8, 9, 7),
            new Match(8, 2, 3),
            new Match(8, 8, 1),
            new Match(8, 5, 0),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('10 teams, reserved matches, all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 2, 4),
            new Match(0, 7, 9),
            new Match(0, 8, 6),
            new Match(0, 1, 0),
            new Match(0, 5, 3),
            new Match(1, 8, 4),
            new Match(1, 0, 2),
            new Match(1, 9, 5),
            new Match(1, 1, 3),
            new Match(1, 7, 6),
            new Match(2, 4, 7),
            new Match(2, 3, 0),
            new Match(2, 1, 8),
            new Match(2, 6, 5),
            new Match(2, 9, 2),
            new Match(3, 2, 8),
            new Match(3, 0, 9),
            new Match(3, 1, 5),
            new Match(3, 7, 3),
            new Match(3, 4, 6),
            new Match(4, 6, 9),
            new Match(4, 8, 7),
            new Match(4, 4, 3),
            new Match(4, 5, 0),
            new Match(4, 2, 1),
            new Match(5, 3, 2),
            new Match(5, 1, 6),
            new Match(5, 9, 8),
            new Match(5, 7, 0),
            new Match(5, 4, 5),
            new Match(6, 8, 5),
            new Match(6, 0, 6),
            new Match(6, 2, 7),
            new Match(6, 3, 9),
            new Match(6, 4, 1),
            new Match(7, 5, 2),
            new Match(7, 4, 9),
            new Match(7, 0, 8),
            new Match(7, 6, 3),
            new Match(7, 1, 7),
            new Match(8, 3, 8),
            new Match(8, 4, 0),
            new Match(8, 7, 5),
            new Match(8, 2, 6),
            new Match(8, 9, 1),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 10 teams, reserved matches, team 6 plays twice in round 6', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 8, 3),
            new Match(0, 7, 1),
            new Match(0, 9, 4),
            new Match(0, 6, 2),
            new Match(0, 5, 0),
            new Match(1, 8, 4),
            new Match(1, 0, 3),
            new Match(1, 7, 2),
            new Match(1, 6, 9),
            new Match(1, 5, 1),
            new Match(2, 5, 7),
            new Match(2, 8, 6),
            new Match(2, 3, 1),
            new Match(2, 0, 4),
            new Match(2, 2, 9),
            new Match(3, 0, 6),
            new Match(3, 7, 9),
            new Match(3, 4, 3),
            new Match(3, 1, 8),
            new Match(3, 5, 2),
            new Match(4, 2, 3),
            new Match(4, 0, 1),
            new Match(4, 7, 8),
            new Match(4, 5, 9),
            new Match(4, 4, 6),
            new Match(5, 4, 2),
            new Match(5, 3, 7),
            new Match(5, 0, 9),
            new Match(5, 8, 5),
            new Match(5, 6, 1),
            new Match(6, 8, 0),
            new Match(6, 1, 2),
            new Match(6, 6, 7),
            new Match(6, 6, 5),
            new Match(6, 9, 3),
            new Match(7, 5, 3),
            new Match(7, 4, 1),
            new Match(7, 2, 0),
            new Match(7, 6, 7),
            new Match(7, 8, 9),
            new Match(8, 4, 5),
            new Match(8, 8, 2),
            new Match(8, 0, 7),
            new Match(8, 9, 1),
            new Match(8, 6, 3),
        ]
        let numTeams = 10
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            done.fail('Expected to throw Error')
        }).catch((err: Error) => {
            expect(err.message).toBe('Reserved Matches clash with basic constraints in this rotation.')
            done()
        })
    }, timeout)

    it('12 teams, reserved matches, all round 0 reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 10, 6),
            new Match(0, 1, 7),
            new Match(0, 4, 9),
            new Match(0, 8, 5),
            new Match(0, 3, 11),
            new Match(0, 2, 0),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('12 teams, reserved matches, last round reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(10, 11, 1),
            new Match(10, 6, 10),
            new Match(10, 3, 7),
            new Match(10, 5, 8),
            new Match(10, 9, 2),
            new Match(10, 4, 0),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('12 teams, reserved matches, reserved matches scattered, unordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(9, 0, 5),
            new Match(10, 5, 9),
            new Match(7, 9, 11),
            new Match(8, 2, 4),
            new Match(5, 9, 4),
            new Match(6, 7, 8),
            new Match(3, 4, 10),
            new Match(4, 5, 8),
            new Match(1, 2, 11),
            new Match(2, 11, 0),
            new Match(0, 8, 4),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('12 teams, reserved matches, reserved matches scattered, ordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 11, 7),
            new Match(1, 3, 0),
            new Match(2, 6, 4),
            new Match(3, 7, 9),
            new Match(4, 10, 7),
            new Match(5, 3, 10),
            new Match(6, 0, 1),
            new Match(7, 0, 10),
            new Match(8, 7, 1),
            new Match(9, 4, 3),
            new Match(10, 4, 11),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('12 teams, reserved matches, first and last rounds all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 5, 4),
            new Match(0, 9, 6),
            new Match(0, 1, 2),
            new Match(0, 7, 11),
            new Match(0, 10, 3),
            new Match(0, 8, 0),
            new Match(10, 10, 5),
            new Match(10, 11, 0),
            new Match(10, 1, 8),
            new Match(10, 6, 2),
            new Match(10, 7, 4),
            new Match(10, 9, 3),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('12 teams, reserved matches, all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 10, 3),
            new Match(0, 6, 2),
            new Match(0, 9, 1),
            new Match(0, 5, 4),
            new Match(0, 11, 8),
            new Match(0, 0, 7),
            new Match(1, 6, 5),
            new Match(1, 7, 8),
            new Match(1, 1, 2),
            new Match(1, 9, 3),
            new Match(1, 4, 11),
            new Match(1, 10, 0),
            new Match(2, 11, 3),
            new Match(2, 2, 5),
            new Match(2, 7, 1),
            new Match(2, 10, 8),
            new Match(2, 0, 9),
            new Match(2, 4, 6),
            new Match(3, 10, 7),
            new Match(3, 3, 2),
            new Match(3, 4, 0),
            new Match(3, 6, 9),
            new Match(3, 1, 11),
            new Match(3, 8, 5),
            new Match(4, 6, 10),
            new Match(4, 1, 0),
            new Match(4, 7, 2),
            new Match(4, 3, 8),
            new Match(4, 11, 5),
            new Match(4, 9, 4),
            new Match(5, 6, 1),
            new Match(5, 2, 4),
            new Match(5, 9, 5),
            new Match(5, 11, 10),
            new Match(5, 0, 8),
            new Match(5, 7, 3),
            new Match(6, 2, 10),
            new Match(6, 3, 0),
            new Match(6, 6, 11),
            new Match(6, 8, 9),
            new Match(6, 5, 7),
            new Match(6, 1, 4),
            new Match(7, 7, 11),
            new Match(7, 9, 10),
            new Match(7, 1, 5),
            new Match(7, 6, 0),
            new Match(7, 2, 8),
            new Match(7, 3, 4),
            new Match(8, 7, 9),
            new Match(8, 0, 5),
            new Match(8, 6, 3),
            new Match(8, 2, 11),
            new Match(8, 4, 10),
            new Match(8, 8, 1),
            new Match(9, 11, 9),
            new Match(9, 5, 10),
            new Match(9, 0, 2),
            new Match(9, 7, 6),
            new Match(9, 3, 1),
            new Match(9, 4, 8),
            new Match(10, 5, 3),
            new Match(10, 10, 1),
            new Match(10, 8, 6),
            new Match(10, 4, 7),
            new Match(10, 2, 9),
            new Match(10, 11, 0),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 12 teams, reserved matches, team 3 plays twice in round 8', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 5, 0),
            new Match(0, 4, 10),
            new Match(0, 6, 9),
            new Match(0, 8, 11),
            new Match(0, 3, 1),
            new Match(0, 2, 7),
            new Match(1, 6, 3),
            new Match(1, 10, 5),
            new Match(1, 8, 7),
            new Match(1, 1, 4),
            new Match(1, 0, 2),
            new Match(1, 9, 11),
            new Match(2, 9, 1),
            new Match(2, 5, 4),
            new Match(2, 7, 3),
            new Match(2, 0, 8),
            new Match(2, 10, 6),
            new Match(2, 11, 2),
            new Match(3, 11, 4),
            new Match(3, 3, 8),
            new Match(3, 5, 2),
            new Match(3, 1, 10),
            new Match(3, 6, 0),
            new Match(3, 9, 7),
            new Match(4, 8, 6),
            new Match(4, 7, 11),
            new Match(4, 10, 9),
            new Match(4, 0, 3),
            new Match(4, 1, 5),
            new Match(4, 4, 2),
            new Match(5, 4, 3),
            new Match(5, 0, 7),
            new Match(5, 9, 2),
            new Match(5, 8, 10),
            new Match(5, 6, 5),
            new Match(5, 11, 1),
            new Match(6, 10, 7),
            new Match(6, 3, 11),
            new Match(6, 0, 1),
            new Match(6, 2, 8),
            new Match(6, 5, 9),
            new Match(6, 4, 6),
            new Match(7, 11, 6),
            new Match(7, 1, 7),
            new Match(7, 2, 3),
            new Match(7, 4, 9),
            new Match(7, 8, 5),
            new Match(7, 0, 10),
            new Match(8, 10, 3),
            new Match(8, 9, 8),
            new Match(8, 5, 11),
            new Match(8, 1, 2),
            new Match(8, 3, 0),
            new Match(8, 6, 7),
            new Match(9, 8, 1),
            new Match(9, 5, 3),
            new Match(9, 2, 6),
            new Match(9, 0, 9),
            new Match(9, 11, 10),
            new Match(9, 4, 7),
            new Match(10, 2, 10),
            new Match(10, 8, 4),
            new Match(10, 11, 0),
            new Match(10, 1, 6),
            new Match(10, 3, 9),
            new Match(10, 5, 7),
        ]
        let numTeams = 12
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            done.fail('Expected to throw Error')
        }).catch((err: Error) => {
            expect(err.message).toBe('Reserved Matches clash with basic constraints in this rotation.')
            done()
        })
    }, timeout)

    it('14 teams, reserved matches, all round 0 reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 13, 9),
            new Match(0, 12, 6),
            new Match(0, 5, 3),
            new Match(0, 1, 2),
            new Match(0, 4, 8),
            new Match(0, 11, 7),
            new Match(0, 0, 10),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('14 teams, reserved matches, last round reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(12, 4, 1),
            new Match(12, 12, 2),
            new Match(12, 11, 13),
            new Match(12, 9, 8),
            new Match(12, 10, 5),
            new Match(12, 3, 0),
            new Match(12, 6, 7),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('14 teams, reserved matches, reserved matches scattered, unordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(10, 0, 10),
            new Match(11, 7, 12),
            new Match(12, 10, 5),
            new Match(8, 7, 10),
            new Match(8, 6, 12),
            new Match(5, 8, 0),
            new Match(6, 1, 6),
            new Match(0, 5, 3),
            new Match(1, 8, 2),
            new Match(2, 1, 0),
            new Match(2, 11, 2),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('14 teams, reserved matches, reserved matches scattered, ordered', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 3, 2),
            new Match(1, 11, 1),
            new Match(2, 2, 1),
            new Match(3, 11, 2),
            new Match(4, 8, 10),
            new Match(5, 10, 11),
            new Match(6, 8, 4),
            new Match(7, 11, 12),
            new Match(8, 7, 2),
            new Match(9, 2, 10),
            new Match(10, 4, 11),
            new Match(11, 1, 7),
            new Match(12, 7, 3),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('14 teams, reserved matches, first and last rounds all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 13, 7),
            new Match(0, 9, 11),
            new Match(0, 10, 1),
            new Match(0, 5, 2),
            new Match(0, 8, 12),
            new Match(0, 0, 3),
            new Match(0, 4, 6),
            new Match(12, 12, 13),
            new Match(12, 1, 4),
            new Match(12, 8, 3),
            new Match(12, 7, 9),
            new Match(12, 10, 11),
            new Match(12, 2, 6),
            new Match(12, 5, 0),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('14 teams, reserved matches, all reserved', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 13, 7),
            new Match(0, 12, 10),
            new Match(0, 0, 1),
            new Match(0, 5, 3),
            new Match(0, 2, 9),
            new Match(0, 6, 4),
            new Match(0, 11, 8),
            new Match(1, 6, 11),
            new Match(1, 4, 1),
            new Match(1, 0, 3),
            new Match(1, 2, 13),
            new Match(1, 7, 5),
            new Match(1, 9, 12),
            new Match(1, 10, 8),
            new Match(2, 4, 3),
            new Match(2, 8, 0),
            new Match(2, 5, 6),
            new Match(2, 9, 1),
            new Match(2, 12, 7),
            new Match(2, 11, 2),
            new Match(2, 13, 10),
            new Match(3, 0, 12),
            new Match(3, 11, 4),
            new Match(3, 8, 13),
            new Match(3, 6, 1),
            new Match(3, 9, 5),
            new Match(3, 7, 10),
            new Match(3, 3, 2),
            new Match(4, 9, 11),
            new Match(4, 3, 6),
            new Match(4, 5, 0),
            new Match(4, 7, 2),
            new Match(4, 8, 12),
            new Match(4, 10, 4),
            new Match(4, 1, 13),
            new Match(5, 7, 1),
            new Match(5, 13, 9),
            new Match(5, 6, 12),
            new Match(5, 11, 5),
            new Match(5, 10, 3),
            new Match(5, 0, 2),
            new Match(5, 4, 8),
            new Match(6, 4, 2),
            new Match(6, 1, 10),
            new Match(6, 13, 5),
            new Match(6, 11, 12),
            new Match(6, 6, 0),
            new Match(6, 8, 7),
            new Match(6, 3, 9),
            new Match(7, 9, 10),
            new Match(7, 11, 3),
            new Match(7, 8, 1),
            new Match(7, 6, 13),
            new Match(7, 2, 12),
            new Match(7, 7, 0),
            new Match(7, 4, 5),
            new Match(8, 4, 13),
            new Match(8, 5, 1),
            new Match(8, 11, 7),
            new Match(8, 10, 0),
            new Match(8, 3, 12),
            new Match(8, 2, 8),
            new Match(8, 9, 6),
            new Match(9, 1, 11),
            new Match(9, 2, 6),
            new Match(9, 8, 3),
            new Match(9, 12, 13),
            new Match(9, 4, 0),
            new Match(9, 5, 10),
            new Match(9, 9, 7),
            new Match(10, 3, 13),
            new Match(10, 7, 4),
            new Match(10, 2, 5),
            new Match(10, 6, 10),
            new Match(10, 8, 9),
            new Match(10, 12, 1),
            new Match(10, 0, 11),
            new Match(11, 4, 12),
            new Match(11, 7, 6),
            new Match(11, 10, 2),
            new Match(11, 3, 1),
            new Match(11, 9, 0),
            new Match(11, 8, 5),
            new Match(11, 11, 13),
            new Match(12, 4, 9),
            new Match(12, 10, 11),
            new Match(12, 12, 5),
            new Match(12, 6, 8),
            new Match(12, 7, 3),
            new Match(12, 1, 2),
            new Match(12, 0, 13),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            let result = TestUtil.testIfTeamsCorrectInAllRounds(testFixture, numRounds, numTeams)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
            result = TestUtil.testIfReservedMatchesCorrect(testFixture, reservedMatches)
            expect(result.result).toBe(true, result.message)
            done()
        })
    }, timeout)

    it('invalid, 14 teams, reserved matches, team 11 plays twice in round 10', (done) => {
        let reservedMatches: Match[] = [
            new Match(0, 2, 4),
            new Match(0, 3, 6),
            new Match(0, 10, 13),
            new Match(0, 1, 5),
            new Match(0, 0, 11),
            new Match(0, 12, 9),
            new Match(0, 8, 7),
            new Match(1, 6, 13),
            new Match(1, 12, 7),
            new Match(1, 8, 9),
            new Match(1, 1, 3),
            new Match(1, 5, 2),
            new Match(1, 10, 0),
            new Match(1, 11, 4),
            new Match(2, 13, 11),
            new Match(2, 2, 0),
            new Match(2, 3, 9),
            new Match(2, 4, 12),
            new Match(2, 5, 7),
            new Match(2, 6, 8),
            new Match(2, 10, 1),
            new Match(3, 6, 1),
            new Match(3, 3, 13),
            new Match(3, 8, 4),
            new Match(3, 2, 7),
            new Match(3, 9, 10),
            new Match(3, 12, 0),
            new Match(3, 5, 11),
            new Match(4, 1, 13),
            new Match(4, 12, 3),
            new Match(4, 11, 6),
            new Match(4, 4, 10),
            new Match(4, 0, 7),
            new Match(4, 2, 9),
            new Match(4, 5, 8),
            new Match(5, 8, 1),
            new Match(5, 12, 5),
            new Match(5, 10, 2),
            new Match(5, 9, 11),
            new Match(5, 3, 7),
            new Match(5, 6, 4),
            new Match(5, 13, 0),
            new Match(6, 8, 13),
            new Match(6, 9, 0),
            new Match(6, 4, 1),
            new Match(6, 2, 12),
            new Match(6, 3, 5),
            new Match(6, 7, 11),
            new Match(6, 6, 10),
            new Match(7, 10, 7),
            new Match(7, 5, 13),
            new Match(7, 11, 12),
            new Match(7, 9, 4),
            new Match(7, 0, 1),
            new Match(7, 3, 8),
            new Match(7, 6, 2),
            new Match(8, 11, 10),
            new Match(8, 3, 0),
            new Match(8, 9, 13),
            new Match(8, 2, 8),
            new Match(8, 6, 5),
            new Match(8, 1, 12),
            new Match(8, 7, 4),
            new Match(9, 2, 1),
            new Match(9, 9, 5),
            new Match(9, 8, 11),
            new Match(9, 6, 0),
            new Match(9, 10, 12),
            new Match(9, 7, 13),
            new Match(9, 3, 4),
            new Match(10, 3, 10),
            new Match(10, 5, 4),
            new Match(10, 11, 6),
            new Match(10, 2, 11),
            new Match(10, 13, 12),
            new Match(10, 0, 8),
            new Match(10, 7, 1),
            new Match(11, 5, 10),
            new Match(11, 7, 6),
            new Match(11, 11, 3),
            new Match(11, 9, 1),
            new Match(11, 0, 4),
            new Match(11, 13, 2),
            new Match(11, 12, 8),
            new Match(12, 5, 0),
            new Match(12, 13, 4),
            new Match(12, 3, 2),
            new Match(12, 6, 12),
            new Match(12, 11, 1),
            new Match(12, 8, 10),
            new Match(12, 9, 7),
        ]
        let numTeams = 14
        let numRounds = numTeams - 1
        TestUtil.runPlotFixtureRotation(numTeams, reservedMatches, numTeams - 1, false).then((testFixture) => {
            done.fail('Expected to throw Error')
        }).catch((err: Error) => {
            expect(err.message).toBe('Reserved Matches clash with basic constraints in this rotation.')
            done()
        })
    }, timeout)

})
