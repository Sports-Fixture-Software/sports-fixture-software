import { plotFixtureRotation } from './plot_fixture_rotation'
import { Team as DFSTeam, Match as DFSMatch } from './fixture_constraints'
import { SchedulerParameters } from '../scheduler.service'
import { TeamConstraints } from './team_constraints'
import * as process from 'process'

export function callPlotFixtureRotation(args: SchedulerParameters): DFSMatch[] {
    let teams: DFSTeam[] = []
    let matches: DFSMatch[] = []
    let index = 0
    for (let team of args.teams) {
        teams.push(new TeamConstraints(index,
            {
                maxHome: team.homeGamesMax,
                maxAway: team.awayGamesMax
            },
            {
                consecutiveHomeGamesMax: team.consecutiveHomeGamesMax,
                consecutiveAwayGamesMax: team.consecutiveAwayGamesMax,
            }))
        index++
    }
    for (let match of args.reservedMatches) {
        matches.push(new DFSMatch(match.roundNum, match.homeTeam, match.awayTeam))
    }
    return plotFixtureRotation(teams, matches, args.numRounds, args.verbose)
}

process.on('message', (args: SchedulerParameters) => {
    // can't send functions to processes, so create teams in this process
    try {
        process.send(callPlotFixtureRotation(args))
    } catch (e) {
        process.send({ name: e.name, message: e.message })
    }
})
