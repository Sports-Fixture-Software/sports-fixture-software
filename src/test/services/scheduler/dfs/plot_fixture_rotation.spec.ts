import { plotFixtureRotation } from '../../../../app/services/scheduler/dfs/plot_fixture_rotation';
import { Match, Constraint, FixtureInterface, Team } from '../../../../app/services/scheduler/dfs/fixture_constraints';

// No special constraints
class TestTeamNoConstraints implements Team {

    constructor() { }

    constraintsSatisfied(fixture: FixtureInterface, proposedMatch: Match, home: boolean): Constraint {
        return Constraint.SATISFIED;
    }
}

interface TestResult {
    result: boolean,
    message?: string
}

/**
 * Test if there are less or more teams in a round than expected, or team
 * duplicates.
 */
function testIfTeamsCorrectInAllRounds(fixture: Match[], numRounds: number, numTeams: number): TestResult {
    for (let r = 0; r < numRounds; r++) {
        let teams: number[] = []
        for (var i: number = 0; i < fixture.length; i++) {
            if (fixture[i].roundNum == r) {
                teams.push(fixture[i].homeTeam)
                teams.push(fixture[i].awayTeam)
            }
        }
        if (teams.length != numTeams) {
            return { result: false, message: `Round ${r}, wrong number ${JSON.stringify(teams)}` }
        }
        if ((new Set(teams)).size != teams.length) {
            return { result: false, message: `Round ${r}, duplicate` }
        }
    }
    return { result: true }
}

function testIfRoundsCorrect(fixture: Match[], numRounds: number): TestResult {
    let rounds = new Set()
    for (let r = 0; r < numRounds; r++) {
        let teams: number[] = []
        for (var i: number = 0; i < fixture.length; i++) {
            if (fixture[i].roundNum == r) {
                rounds.add(r)
            }
        }
    }
    let sorted = (Array.from(rounds)).sort((a: number, b: number) => { return a - b })
    if (sorted.length != numRounds) {
        return { result: false, message: 'Wrong number of rounds' }
    }
    for (let i = 0; i < numRounds; i++) {
        if (sorted[i] != i) {
            return { result: false, message: 'Missing rounds' }
        }
    }
    return { result: true }
}

describe('services DFS scheduler plot fixture rotation', () => {
    it('invalid, 0 teams', () => {
        let reservedMatches: Match[] = []
        let testTeams:TestTeamNoConstraints[] = []
        expect(() => {
            plotFixtureRotation(testTeams, reservedMatches, true)
        }).toThrowError('At least two teams are required to make a fixture.')
    })        

    it('invalid, 1 teams', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
             new TestTeamNoConstraints()
        ]
        expect(() => {
            plotFixtureRotation(testTeams, reservedMatches, true)
        }).toThrowError('At least two teams are required to make a fixture.')
    })

    it('2 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })

    it('invalid, 3 teams', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints()
        ]
        expect(() => {
            plotFixtureRotation(testTeams, reservedMatches, true)
        }).toThrowError('Odd number of teams in the teams parameter. Add a bye to make it even.')
    })

    it('4 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })

    it('6 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })

    it('8 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })

    it('10 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })

    it('12 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })
    it('14 teams, no constraints', () => {
        let reservedMatches: Match[] = []
        let testTeams: TestTeamNoConstraints[] = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ]
        let numRounds = testTeams.length - 1
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
        let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
        expect(result.result).toBe(true, result.message)
        result = testIfRoundsCorrect(testFixture, numRounds)
        expect(result.result).toBe(true, result.message)
    })
    /*
    it('16 - 20 teams, no constraints', () => {
        for (let i = 16; i <= 20; i += 2) {
            let reservedMatches: Match[] = []
            let testTeams: TestTeamNoConstraints[] = []
            for (let j = 0; j < i; j++) {
                testTeams.push(new TestTeamNoConstraints())
            }
            console.log(testTeams.length)
            let numRounds = testTeams.length - 1
            let testFixture = plotFixtureRotation(testTeams, reservedMatches, false)
            let result = testIfTeamsCorrectInAllRounds(testFixture, numRounds, testTeams.length)
            expect(result.result).toBe(true, result.message)
            result = testIfRoundsCorrect(testFixture, numRounds)
            expect(result.result).toBe(true, result.message)
        }
    })
    */
/*
    it('6 teams, no constraints', () => {
        let reservedMatches: Match[] = [];
        let testTeams = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ];
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, true);
        expect(testFixture).toBeDefined()
        console.log("Success. Printing fixture:");
        for (var i: number = 0; i < testFixture.length; i++) {
            console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
        }
    })

    it('6 teams, two reserved games', () => {
        let reservedMatches: Match[] = [
            new Match(0, 0, 1),
            new Match(1, 0, 2)
        ]
        let testTeams = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ];
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, true);
        expect(testFixture).toBeDefined()
        console.log("Success. Printing fixture:");
        for (var i: number = 0; i < testFixture.length; i++) {
            console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
        }
    })

    it('6 teams, full reserved games', () => {
        let reservedMatches: Match[] = [ // This should break as it is not a legal setup
            new Match(0, 0, 1), new Match(0, 2, 5), new Match(0, 3, 4),
            new Match(1, 0, 2), new Match(1, 1, 3), new Match(1, 5, 4),
            new Match(2, 2, 4), new Match(2, 0, 3), new Match(2, 1, 5),
            new Match(3, 5, 0), new Match(3, 3, 2), new Match(3, 4, 1),
            new Match(4, 0, 4), new Match(4, 5, 3), new Match(4, 1, 2)
        ]
        let testTeams = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ];
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, true);
        expect(testFixture).toBeDefined()
        console.log("Success. Printing fixture:");
        for (var i: number = 0; i < testFixture.length; i++) {
            console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
        }
    })
*/
    // 10 teams - this currently takes a long time (too long)
    /*
    it('10 teams, no constraints', () => {
        let reservedMatches: Match[] = [];
        let testTeams = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints()
        ];
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, true);
        expect(testFixture).toBeDefined()
        console.log("Success. Printing fixture:");
        for (var i: number = 0; i < testFixture.length; i++) {
            console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
        }
    })
    */
})
