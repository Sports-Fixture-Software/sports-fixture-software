import { Injectable } from '@angular/core'
import { Fixture } from '../../../models/fixture'
import { Round } from '../../../models/round'
import { Team } from '../../../models/team'
import { Match } from '../../../models/match'
import { FixtureService } from '../../fixture.service'
import { RoundService } from '../../round.service'
import { MatchService } from '../../match.service'
import { Collection } from '../../collection'
import { Team as DFSTeam, Match as DFSMatch, FixtureInterface, Constraint }  from './fixture_constraints'
import { plotFixtureRotation } from './plot_fixture_rotation'
import { Search } from '../../../util/search'
import { DateTime } from '../../../util/date_time'
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
        return this.fixtureService.getFixtureAndTeams(fixture.id).then((f) => {
            this.fixture = f
            return this.fixtureService.getRoundsAndConfig(f)
        }).then((rounds: Collection<Round>) => {
            // add rounds (note: some rounds may already exist)
            this.teams = this.fixture.leaguePreLoaded.teamsPreLoaded.toArray()
            this.rounds = rounds.toArray()
            let newRounds = DateTime.fillInRounds(this.fixture, this.rounds, false)
            return Promise.map(newRounds, (item, index, length) => {
                return this.roundService.addRound(item)
            })
        }).then(() => {
            // delete existing matches for all rounds    
            return Promise.map(this.rounds, (item, index, length) => {
                return this.matchService.deleteMatches(item)
            })
        }).then(() => {
            // convert database data structures to DFS data structures     
            let dfsTeams = this.convertTeams(this.teams)
            let dfsReservedMatches = this.convertReservedMatches(this.rounds)

            let dfsFixture = plotFixtureRotation(dfsTeams, dfsReservedMatches, true)

            // convert the DFS fixture to database matches and add to database.
            return Promise.map(dfsFixture, (item, index, length) => {
                let match = new Match()
                match.round_id = item.roundNum + 1
                let homeId = this.dfsTeamtoTeamMap.get(item.homeTeam)
                if (homeId == undefined) {
                    throw new Error(`cannot find team id ${item.homeTeam}, available ids are ${Array.from(this.dfsTeamtoTeamMap.keys())}`)
                }
                let awayId = this.dfsTeamtoTeamMap.get(item.awayTeam)
                if (awayId == undefined) {
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
            dfsTeams.push(new TestTeamNoConstraints())
            index++
        }
        return dfsTeams
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
                if (config.homeTeam_id == Team.ANY_TEAM_ID || config.homeTeam_id == Team.BYE_TEAM_ID) {
                    homeId = config.homeTeam_id
                } else {
                    homeId = this.teamtoDfsTeamMap.get(config.homeTeam_id)
                    if (homeId == undefined) {
                        throw new Error(`cannot find team id ${config.homeTeam_id}, available ids are ${Array.from(this.teamtoDfsTeamMap.keys())}`)
                    }
                }
                let awayId: number
                if (config.awayTeam_id == Team.ANY_TEAM_ID || config.awayTeam_id == Team.BYE_TEAM_ID) {
                    awayId = config.awayTeam_id
                } else {
                    awayId = this.teamtoDfsTeamMap.get(config.awayTeam_id)
                    if (awayId == undefined) {
                        throw new Error(`cannot find team id ${config.awayTeam_id}, available ids are ${Array.from(this.teamtoDfsTeamMap.keys())}`)
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

class TestTeamNoConstraints implements DFSTeam {

    constructor() { }

    constraintsSatisfied(fixture: FixtureInterface, proposedMatch: DFSMatch, home: boolean): Constraint {
        return Constraint.SATISFIED;
    }
}
