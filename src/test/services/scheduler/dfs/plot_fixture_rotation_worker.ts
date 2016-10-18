import { plotFixtureRotation } from '../../../../app/services/scheduler/dfs/plot_fixture_rotation'
import { Match, Constraint, FixtureInterface, Team } from '../../../../app/services/scheduler/dfs/fixture_constraints';
import * as process from 'process'

// No special constraints
class TestTeamNoConstraints implements Team {

    constructor() { }

    constraintsSatisfied(fixture: FixtureInterface, proposedMatch: Match, home: boolean): Constraint {
        return Constraint.SATISFIED;
    }
}

process.on('message', (args: any[]) => {
    // can't send functions to processes, so create teams in this process
    let teams: Team[] = []
    for (let j = 0; j < args[0]; j++) {
        teams.push(new TestTeamNoConstraints())
    }
    try {
        process.send(plotFixtureRotation(teams, args[1], args[2]))
    } catch (e) {
        process.send({ name: e.name, message: e.message })
    }
})
