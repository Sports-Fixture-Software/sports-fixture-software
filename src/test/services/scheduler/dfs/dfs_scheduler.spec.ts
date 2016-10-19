import { plotFixtureRotation } from '../../../../app/services/scheduler/dfs/plot_fixture_rotation';
import { Match, Constraint, FixtureInterface, Team } from '../../../../app/services/scheduler/dfs/fixture_constraints';

// No special constraints
class TestTeamNoConstraints implements Team {

    constructor() { }

    constraintsSatisfied(fixture: FixtureInterface, proposedMatch: Match, home: boolean): Constraint {
        return Constraint.SATISFIED;
    }
}

describe('services DFS scheduler', () => {
    it('6 teams, no constraints', () => {
        let reservedMatches: Match[] = [];
        let testTeams = [
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
            new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
        ];
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, testTeams.length - 1, true);
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
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, testTeams.length - 1, true);
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
        let testFixture = plotFixtureRotation(testTeams, reservedMatches, testTeams.length - 1, true);
        expect(testFixture).toBeDefined()
        console.log("Success. Printing fixture:");
        for (var i: number = 0; i < testFixture.length; i++) {
            console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
        }
    })

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
