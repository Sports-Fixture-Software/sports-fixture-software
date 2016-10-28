import { Injectable } from '@angular/core'
import { Fixture } from '../../models/fixture'
import { FixtureConfig } from '../../models/fixture_config'
import { LeagueConfig } from '../../models/league_config'
import { Round } from '../../models/round'
import { Team } from '../../models/team'
import { TeamConfig } from '../../models/team_config'
import { Match } from '../../models/match'
import { FixtureService } from '../fixture.service'
import { RoundService } from '../round.service'
import { MatchService } from '../match.service'
import { Collection } from '../collection'
import { Search } from '../../util/search'
import { DateTime } from '../../util/date_time'
import { AppConfig } from '../../util/app_config'
import { Match as SchedulerMatch } from '../../util/scheduler/match'
import { Team as SchedulerTeam } from '../../util/scheduler/team'
import * as Promise from 'bluebird'
import * as child_process from 'child_process'
import * as path from 'path'

// if debugging, select one of the following imports
//import { callPlotFixtureRotation } from './dfs/dfs_worker'
import { callPlotFixtureRotation } from './sim-anneal/sim_anneal_worker'
// end debug only

@Injectable()
export class SchedulerService {

    constructor(private fixtureService: FixtureService,
        private roundService: RoundService,
        private matchService: MatchService) {
    }

    worker: child_process.ChildProcess

    // select the scheduler here:
    //scheduler: string = path.join('dfs', 'dfs_worker')
    scheduler: string = path.join('sim-anneal', 'sim_anneal_worker')
    // end select scheduler

    /**
     * Populate the database with rounds and matches for the specified fixture. 
     */
    generateFixture(fixture: Fixture): Promise<any> {
        return this.fixtureService.getFixtureAndAllRelated(fixture.id).then((f) => {
            this.fixture = f
            // add rounds (note: some rounds may already exist)
            this.teams = this.fixture.leaguePreLoaded.teamsPreLoaded.toArray()
            this.rounds = this.fixture.roundsPreLoaded.toArray()
            let newRounds = DateTime.fillInRounds(this.fixture, this.rounds, false)
            return Promise.map(newRounds, (item, index, length) => {
                return this.roundService.addRound(item)
            })
        }).then(() => {
            return this.fixtureService.getRoundsAndConfig(this.fixture)
        }).then((rounds) => {
            this.rounds = rounds.toArray()
            // delete existing matches for all rounds    
            return Promise.map(this.rounds, (item, index, length) => {
                return this.matchService.deleteMatches(item)
            })
        }).then(() => {
            // check for conflicts with consecutive constraints
            // If the user sets Adelaide as 0 home games, then Adelaide's
            // maximum consecutive away games must be at least the number of rounds
            this.checkConsecutiveConflict(this.teams, this.fixture.fixtureConfigPreLoaded, this.fixture.leaguePreLoaded.leagueConfigPreLoaded, this.rounds.length)

            // convert database data structures to DFS data structures     
            let dfsTeams = this.convertTeams(this.teams)
            let dfsReservedMatches = this.convertReservedMatches(this.rounds)
            return this.runPlotFixtureRotation(this.scheduler, dfsTeams, dfsReservedMatches, this.rounds.length, AppConfig.isDeveloperMode())
        }).then((dfsFixture) => {
            // convert the DFS fixture to database matches and add to database.
            return Promise.map(dfsFixture, (item, index, length) => {
                let match = new Match()

                let roundIndex = Search.binarySearch(this.rounds, item.roundNum + 1, (a: number, b: Round) => {
                    return a - b.number
                })
                if (roundIndex < 0) {
                    throw new Error(`cannot find round number ${item.roundNum}`)
                }
                match.round_id = this.rounds[roundIndex].id

                let homeId = this.dfsTeamtoTeamMap.get(item.homeTeam)
                if (homeId != null && homeId == undefined) { // null is bye
                    throw new Error(`cannot find team id ${item.homeTeam}, available ids are ${Array.from(this.dfsTeamtoTeamMap.keys())}`)
                }
                let awayId = this.dfsTeamtoTeamMap.get(item.awayTeam)
                if (awayId != null && awayId == undefined) {
                    throw new Error(`cannot find team id ${item.awayTeam}, available ids are ${Array.from(this.dfsTeamtoTeamMap.keys())}`)
                }
                match.homeTeam_id = homeId
                match.awayTeam_id = awayId
                return this.matchService.addMatch(match)
            })
        })
    }

    /**
     * Cancel the current scheduling process
     */
    generateCancel() {
        if (this.worker) {
            this.worker.kill()
        }
    }

    /**
     * Check for conflict with consecutive constraint.
     * The consecutive away constraint must be consistent with max home constraint.
     * e.g. If the user sets Adelaide as 0 home games, then Adelaide's
     * maximum consecutive away games must be at least the number of rounds
     */
    checkConsecutiveConflict(teams: Team[], fixtureConfig: FixtureConfig, leagueConfig: LeagueConfig, numRounds: number) {
        for (let team of teams) {
            let consecutiveConstraint = this.calculateConsecutiveConstraint(team.teamConfigPreLoaded, this.fixture.fixtureConfigPreLoaded, this.fixture.leaguePreLoaded.leagueConfigPreLoaded)
            if (consecutiveConstraint.consecutiveAwayGamesMax < numRounds / (team.teamConfigPreLoaded.homeGamesMax + 1)) {
                throw new Error(`${team.name} has ${team.teamConfigPreLoaded.homeGamesMax} maximum home games, but has ${consecutiveConstraint.consecutiveAwayGamesMax} maximum consecutive away games. Consider increasing maximum consecutive away games for team ${team.name}`)
            }
            if (consecutiveConstraint.consecutiveHomeGamesMax < numRounds / (team.teamConfigPreLoaded.awayGamesMax + 1)) {
                throw new Error(`${team.name} has ${team.teamConfigPreLoaded.homeGamesMax} maximum away games, but has ${consecutiveConstraint.consecutiveHomeGamesMax} maximum consecutive home games. Consider increasing maximum consecutive away games for team ${team.name}`)
            }
        }
    }

    /**
     * Convert database data structure `teams` to DFS data structure.
     *
     * Returns the DFS data structure
     */
    private convertTeams(teams: Team[]): SchedulerTeam[] {
        let dfsTeams: SchedulerTeam[] = [];
        let index = 0
        for (let team of teams) {
            this.teamtoDfsTeamMap.set(team.id, index)
            this.dfsTeamtoTeamMap.set(index, team.id)
            //let newTeam: SchedulerTeam = new SchedulerTeam()

            let teamConstraint = this.calculateTeamConstraint(team.teamConfigPreLoaded)
            let consecutiveConstraint = this.calculateConsecutiveConstraint(team.teamConfigPreLoaded, this.fixture.fixtureConfigPreLoaded, this.fixture.leaguePreLoaded.leagueConfigPreLoaded)
            let newTeam: SchedulerTeam = {
                homeGamesMax: teamConstraint.maxHome,
                awayGamesMax: teamConstraint.maxAway,
                consecutiveHomeGamesMax: consecutiveConstraint.consecutiveHomeGamesMax,
                consecutiveAwayGamesMax: consecutiveConstraint.consecutiveAwayGamesMax
            }
            dfsTeams.push(newTeam)
            index++
        }
        // add bye team
        if (teams.length % 2 != 0) {
            this.teamtoDfsTeamMap.set(null, index)
            this.dfsTeamtoTeamMap.set(index, null)
            dfsTeams.push({
                homeGamesMax: -1,
                awayGamesMax: -1,
                consecutiveHomeGamesMax: -1,
                consecutiveAwayGamesMax: -1,
            })
        }
        return dfsTeams
    }

    /**
     * Calculate the maxHome and maxAway constraints from the supplied `config`.
     * Min home games is converted to max away games, and
     * Min away games is converted to max home games.
     */
    private calculateTeamConstraint(config: TeamConfig): TeamConstraintInfo {
        return {
            maxHome: config.homeGamesMax == null || config.homeGamesMax == undefined ? -1 : Math.min(config.homeGamesMax, this.rounds.length - config.awayGamesMin),
            maxAway: config.awayGamesMax == null || config.awayGamesMax == undefined ? -1 : Math.min(config.awayGamesMax, this.rounds.length - config.homeGamesMin)
        }
    }

    private calculateConsecutiveConstraint(teamConfig: TeamConfig, fixtureConfig: FixtureConfig, leagueConfig: LeagueConfig): LeagueFixtureConstraintInfo {
        let consecutiveHomeGamesMax = -1
        if (teamConfig.consecutiveHomeGamesMax != null && teamConfig.consecutiveHomeGamesMax != undefined) {
            consecutiveHomeGamesMax = teamConfig.consecutiveHomeGamesMax
        } else if (fixtureConfig.consecutiveHomeGamesMax != null && fixtureConfig.consecutiveHomeGamesMax != undefined) {
            consecutiveHomeGamesMax = fixtureConfig.consecutiveHomeGamesMax
        } else if (leagueConfig.consecutiveHomeGamesMax != null && leagueConfig.consecutiveHomeGamesMax != undefined) {
            consecutiveHomeGamesMax = leagueConfig.consecutiveHomeGamesMax
        }
        let consecutiveAwayGamesMax = -1
        if (teamConfig.consecutiveAwayGamesMax != null && teamConfig.consecutiveAwayGamesMax != undefined) {
            consecutiveAwayGamesMax = teamConfig.consecutiveAwayGamesMax
        } else if (fixtureConfig.consecutiveAwayGamesMax != null && fixtureConfig.consecutiveAwayGamesMax != undefined) {
            consecutiveAwayGamesMax = fixtureConfig.consecutiveAwayGamesMax
        } else if (leagueConfig.consecutiveAwayGamesMax != null && leagueConfig.consecutiveAwayGamesMax != undefined) {
            consecutiveAwayGamesMax = leagueConfig.consecutiveAwayGamesMax
        }
        return {
            consecutiveHomeGamesMax: consecutiveHomeGamesMax,
            consecutiveAwayGamesMax: consecutiveAwayGamesMax,
        }
    }


    /**
     * Convert database data structure `rounds` to DFS data structure.
     *
     * Returns the DFS data structure
     */
    private convertReservedMatches(rounds: Round[]): SchedulerMatch[] {
        let reservedMatches: SchedulerMatch[] = []
        for (let round of rounds) {
            for (let config of round.matchConfigsPreLoaded) {
                let homeId: number
                let awayId: number
                if (config.homeTeam_id == Team.ANY_TEAM_ID && config.awayTeam_id == Team.BYE_TEAM_ID) {
                    homeId = config.homeTeam_id
                    awayId = config.awayTeam_id
                } else {
                    homeId = this.teamtoDfsTeamMap.get(config.homeTeam_id)
                    if (homeId == undefined) {
                        AppConfig.log(`cannot find team id ${config.homeTeam_id}, available ids are ${Array.from(this.teamtoDfsTeamMap.keys())}`)
                        continue
                    }
                    awayId = this.teamtoDfsTeamMap.get(config.awayTeam_id)
                    if (awayId == undefined) {
                        AppConfig.log(`cannot find team id ${config.awayTeam_id}, available ids are ${Array.from(this.teamtoDfsTeamMap.keys())}`)
                        continue
                    }
                }
                reservedMatches.push(new SchedulerMatch(round.number - 1, homeId, awayId))
            }
        }
        return reservedMatches
    }

    /**
     * Runs the plotFixtureRotation function from services in a separate thread.
     * Returns a Promise of the plotFixtureRotation result.
     */
    runPlotFixtureRotation(scheduler: string, teams: SchedulerTeam[], reservedMatches: SchedulerMatch[], numRounds: number, verbose: boolean): Promise<SchedulerMatch[]> {
        return new Promise<SchedulerMatch[]>((resolve, reject) => {
            let parameters: SchedulerParameters = {
                teams: teams,
                reservedMatches: reservedMatches,
                numRounds: numRounds,
                verbose: verbose,
            }
            this.runPlotFixtureRotationOnNewThread(scheduler, parameters, resolve, reject)
            // For debugging: To run the scheduler in the current thread
            // uncomment following line, and comment above line.
            //this.runPlotFixtureRotationDebugging(parameters, resolve, reject)
        })
    }

    private runPlotFixtureRotationOnNewThread(scheduler: string, parameters: SchedulerParameters, resolve: any, reject: any) {
        this.worker = child_process.fork(path.join(__dirname, scheduler))
        this.worker.send(parameters)
        this.worker.on('message', (testFixture: any) => {
            if (testFixture.message) {
                let err = new Error()
                err.name = testFixture.name
                err.message = testFixture.message
                return reject(err)
            }
            return resolve(testFixture)
        })
    }

    /**
     * To run the scheduler in the current thread. Useful for debugging.
     */
    private runPlotFixtureRotationDebugging(parameters: SchedulerParameters, resolve: any, reject: any) {
        try {
            resolve(callPlotFixtureRotation(parameters))
        } catch (err) {
            reject(err)
        }
    }


    private teamtoDfsTeamMap = new Map<number, number>()
    private dfsTeamtoTeamMap = new Map<number, number>()
    private rounds: Round[]
    private teams: Team[]
    private fixture: Fixture
}

/**
 * The parameters passed to scheduler in a separate thread.
 * Thread messages can only be sent as objects.
 */
export interface SchedulerParameters {
    teams: SchedulerTeam[],
    reservedMatches: SchedulerMatch[],
    numRounds: number,
    verbose: boolean,
}

export interface TeamConstraintInfo {
    maxHome: number,
    maxAway: number
}

export interface LeagueFixtureConstraintInfo {
    consecutiveHomeGamesMax: number,
    consecutiveAwayGamesMax: number,
}
