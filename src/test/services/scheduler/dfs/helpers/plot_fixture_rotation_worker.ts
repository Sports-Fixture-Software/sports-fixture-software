import { plotFixtureRotation } from '../../../../../app/services/scheduler/dfs/plot_fixture_rotation'
import { Team } from '../../../../../app/services/scheduler/dfs/fixture_constraints'
import { Constraint } from '../../../../../app/util/constraint_factory'
import { TestTeamNoConstraints } from './test_util'
import * as process from 'process'

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
