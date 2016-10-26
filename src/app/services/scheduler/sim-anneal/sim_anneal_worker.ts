import { plotFixtureRotation } from './plot_fixture_rotation'
import { SchedulerParameters } from '../scheduler.service'
import { Match } from '../../../util/scheduler/match' 
import * as process from 'process'

export function callPlotFixtureRotation(args: SchedulerParameters): Match[] {
    return plotFixtureRotation(args.teams, args.reservedMatches, args.numRounds, args.verbose)
}

process.on('message', (args: SchedulerParameters) => {
    try {
        process.send(callPlotFixtureRotation(args))
    } catch (e) {
        process.send({ name: e.name, message: e.message })
    }
})
