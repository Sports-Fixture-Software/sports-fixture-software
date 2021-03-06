import { Match } from '../../../../../app/util/scheduler/match'
import { Team } from '../../../../../app/util/scheduler/team'
import { SchedulerService } from '../../../../../app/services/scheduler/scheduler.service'
// import { plotFixtureRotation } from '../../../../../app/services/scheduler/dfs/plot_fixture_rotation';
// import { Match, Team } from '../../../../../app/services/scheduler/dfs/fixture_constraints';
import { Constraint, FixtureInterface } from '../../../../../app/util/constraint_factory'
import * as child_process from 'child_process'
import * as path from 'path'
import * as Promise from 'bluebird'

export interface TestResult {
    result: boolean,
    message?: string
}

export class TestUtil {

    static worker: child_process.ChildProcess
    static schedulerService: SchedulerService = new SchedulerService(null, null, null)

    /**
     * Test if there are less or more teams in a round than expected, or team
     * duplicates.
     */
    static testIfTeamsCorrectInAllRounds(fixture: Match[], numRounds: number, numTeams: number): TestResult {
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

    /**
     * Tests if all round numbers exist
     */
    static testIfRoundsCorrect(fixture: Match[], numRounds: number): TestResult {
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

    /**
     * Tests all reserved matches are met
     */
    static testIfReservedMatchesCorrect(fixture: Match[], reservedMatches: Match[]): TestResult {
        for (let resMatch of reservedMatches) {
            let found = false
            for (let match of fixture) {
                if (match.roundNum == resMatch.roundNum
                    && match.homeTeam == resMatch.homeTeam
                    && match.awayTeam == resMatch.awayTeam) {
                    found = true
                    break
                }
            }
            if (!found) {
                return { result: false, message: `Match ${JSON.stringify(resMatch)}` }
            }
        }
        return { result: true }
    }

    /**
     * Runs the plotFixtureRotation function from services in a separate thread.
     * Returns a Promise of the plotFixtureRotation result.
     */
    static runPlotFixtureRotation(numTeams: number, reservedMatches: Match[], numRounds: number, verbose: boolean): Promise<Match[]> {
        let teams: Team[] = []
        for (let i = 0; i < numTeams; i++) {
            teams.push({ homeGamesMax: -1, awayGamesMax: -1, consecutiveHomeGamesMax: -1, consecutiveAwayGamesMax: -1 })
        }
        return this.schedulerService.runPlotFixtureRotation(path.join('dfs', 'dfs_worker'), teams, reservedMatches, numRounds, verbose)
    }
}
