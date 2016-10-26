import { Injectable } from '@angular/core'
import { Fixture } from '../../../models/fixture'
import { Round } from '../../../models/round'
import { Team } from '../../../models/team'
import { TeamConfig } from '../../../models/team_config'
import { Match } from '../../../models/match'
import { FixtureService } from '../../fixture.service'
import { RoundService } from '../../round.service'
import { MatchService } from '../../match.service'
import { Collection } from '../../collection'
import { Team as DFSTeam, Match as DFSMatch, FixtureInterface }  from './fixture_constraints'
import { plotFixtureRotation } from './plot_fixture_rotation'
import { Search } from '../../../util/search'
import { DateTime } from '../../../util/date_time'
import { AppConfig } from '../../../util/app_config'
import { TeamConstraints, LeagueFixtureConstraintInfo, TeamConstraintInfo } from './team_constraints'
import * as Promise from 'bluebird'

@Injectable()
export class SchedulerService {

    constructor(private fixtureService: FixtureService,
        private roundService: RoundService,
        private matchService: MatchService) {
    }

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
            // convert database data structures to DFS data structures     
            let dfsTeams = this.convertTeams(this.teams)
            let dfsReservedMatches = this.convertReservedMatches(this.rounds)

            let dfsFixture = plotFixtureRotation(dfsTeams, dfsReservedMatches, this.rounds.length, false)

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
     * Convert database data structure `teams` to DFS data structure.
     *
     * Returns the DFS data structure
     */
    private convertTeams(teams: Team[]): DFSTeam[] {
        let dfsTeams: DFSTeam[] = [];
        let index = 0
        for (let team of teams) {
            this.teamtoDfsTeamMap.set(team.id, index)
            this.dfsTeamtoTeamMap.set(index, team.id)
            let teamConstraint = this.calculateTeamConstraint(team.teamConfigPreLoaded)
            let leagueFixtureConstraint: LeagueFixtureConstraintInfo = {
                // if config not set at fixture level, consult league level
                consecutiveHomeGamesMax: this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax == null || this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax == undefined ? this.fixture.leaguePreLoaded.leagueConfigPreLoaded.consecutiveHomeGamesMax : this.fixture.fixtureConfigPreLoaded.consecutiveHomeGamesMax,
                consecutiveAwayGamesMax: this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax == null || this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax == undefined ? this.fixture.leaguePreLoaded.leagueConfigPreLoaded.consecutiveAwayGamesMax : this.fixture.fixtureConfigPreLoaded.consecutiveAwayGamesMax,
             }
            dfsTeams.push(new TeamConstraints(index, teamConstraint, leagueFixtureConstraint))
            index++
        }
        // add bye team
        if (teams.length % 2 != 0) {
            this.teamtoDfsTeamMap.set(null, index)
            this.dfsTeamtoTeamMap.set(index, null)
            dfsTeams.push(new TeamConstraints(index,
                { maxHome: undefined, maxAway: undefined },
                { consecutiveHomeGamesMax: undefined, consecutiveAwayGamesMax: undefined }))
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
            maxHome: config.homeGamesMax == null || config.homeGamesMax == undefined ? undefined : Math.min(config.homeGamesMax, this.rounds.length - config.awayGamesMin),
            maxAway: config.awayGamesMax == null || config.awayGamesMax == undefined ? undefined : Math.min(config.awayGamesMax, this.rounds.length - config.homeGamesMin)
        }
    }


    /**
     * Convert database data structure `rounds` to DFS data structure.
     *
     * Returns the DFS data structure
     */
    private convertReservedMatches(rounds: Round[]): DFSMatch[] {
        let reservedMatches: DFSMatch[] = []
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
                reservedMatches.push(new DFSMatch(round.number - 1, homeId, awayId))
            }
        }
        return reservedMatches
    }

    private teamtoDfsTeamMap = new Map<number, number>()
    private dfsTeamtoTeamMap = new Map<number, number>()
    private rounds: Round[]
    private teams: Team[]
    private fixture: Fixture
}
