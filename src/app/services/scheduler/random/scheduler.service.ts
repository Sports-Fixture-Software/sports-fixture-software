import { Injectable } from '@angular/core'
import { Fixture } from '../../../models/fixture'
import { Round } from '../../../models/round'
import { Team } from '../../../models/team'
import { Match } from '../../../models/match'
import { League } from '../../../models/league'
import { FixtureService } from '../../fixture.service'
import { RoundService } from '../../round.service'
import { TeamService } from '../../team.service'
import { MatchService } from '../../match.service'
import { DateTime } from '../../../util/date_time'
import { DaysOfWeek } from '../../../util/days_of_week'
import { Search } from '../../../util/search'
import * as Promise from 'bluebird'
import * as moment from 'moment'

@Injectable()
export class SchedulerService {

    constructor(private fixtureService: FixtureService,
        private roundService: RoundService,
        private teamService: TeamService,
        private matchService: MatchService) {
    }

    /**
     * Populate the database with rounds and matches for the specified fixture. 
     */
    generateFixture(fixture: Fixture): Promise<any> {
        return this.fixtureService.getRounds(fixture).then((r) => {
            let rounds = r.toArray()
            let newRounds = DateTime.fillInRounds(fixture, rounds, false)
            return Promise.map(newRounds, (item, index, length) => {
                return this.roundService.addRound(item)
            })
        }).then(() => {
            return this.fixtureService.getFixtureAndTeams(fixture.id)
        }).then((fixture: Fixture) => {
            this.teams = fixture.leaguePreLoaded.teamsPreLoaded.toArray()
            // for testing only
            return this.randomFixture(fixture)
        })
    }

    /**
     * Generate a random fixture. For testing purposes only. Allows testing of
     * the review component.
     */
    randomFixture(fixture: Fixture): Promise<any> {
        let homeTeam: Team
        let awayTeam: Team
        let teamRemaining: Team[]
        let index: number
        let newMatches: Promise<Match>[] = []
        let delMatches: Promise<Match>[] = []
        return this.fixtureService.getRounds(fixture).then((rounds) => {
            rounds.forEach((round) => {
                delMatches.push(this.matchService.deleteMatches(round))
                teamRemaining = this.teams.slice(0) //copy
                while (teamRemaining.length > 1) {
                    index = Math.floor((Math.random() * teamRemaining.length))
                    homeTeam = teamRemaining[index]
                    teamRemaining.splice(index, 1)
                    index = Math.floor((Math.random() * teamRemaining.length))
                    awayTeam = teamRemaining[index]
                    teamRemaining.splice(index, 1)
                    let match = new Match()
                    match.setRound(round)
                    match.setHomeTeam(homeTeam)
                    match.setAwayTeam(awayTeam)
                    newMatches.push(this.matchService.addMatch(match))
                }
                if (teamRemaining.length == 1) {
                    homeTeam = teamRemaining[0]
                    let match = new Match()
                    match.setRound(round)
                    match.setHomeTeam(homeTeam)
                    newMatches.push(this.matchService.addMatch(match))
                }
            })
            return Promise.all(delMatches)
        }).then(() => {
            return Promise.all(newMatches)
        })
    }

    private teams: Team[]
}
