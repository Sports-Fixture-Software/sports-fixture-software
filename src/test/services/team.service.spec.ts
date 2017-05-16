/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { databaseInjector } from '../../app/services/database_injector'
import { DatabaseService } from '../../app/services/database.service'
import { LeagueService } from '../../app/services/league.service'
import { FixtureService } from '../../app/services/fixture.service'
import { TeamService } from '../../app/services/team.service'
import { TeamConfigService } from '../../app/services/team_config.service'
import { AppConfig } from '../../app/util/app_config'
import { League } from '../../app/models/league'
import { Fixture } from '../../app/models/fixture'
import { Team } from '../../app/models/team'
import { TeamConfig } from '../../app/models/team_config'
import * as Promise from 'bluebird'

/**
 * Unit tests for the TeamService
 */
describe('services TeamService', () => {
    beforeEach((done) => {
        let databaseService = databaseInjector.get(DatabaseService)
        databaseService.cleanDatabase().then(() => {
            return databaseService.init()
        }).then(() => {
            done()
        })
    })

    it('get teams, no teams', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let league = new League('league1')
        leagueService.addLeague(league).then((l) => {
            league = l
            return teamService.getTeams(l)
        }).then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('get teams, 1 team', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let league = new League('league1')
        let team = new Team('adelaide')
        leagueService.addLeague(league).then((l) => {
            league = l
            team.setLeague(league)
            return teamService.addTeam(team)
        }).then(() => {
            return teamService.getTeams(league)
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(team.name)
            done()
        })
    })

    it('get teams by id', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let league = new League('league1')
        let teams = [
            new Team('alpha'),
            new Team('bravo'),
            new Team('charlie'),
            new Team('delta'),
            new Team('echo'),
        ]
        leagueService.addLeague(league).then((l) => {
            league = l
            for (let team of teams) {
                team.setLeague(league)
            }
            return Promise.each(teams, (item, index, len) => {
                return teamService.addTeam(item)
            })
        }).then(() => {
            return teamService.getTeams()
        }).then((l) => {
            teams = l.toArray()
            return teamService.getTeam(teams[2].id)
        }).then((l) => {
            expect(l.name).toBe(teams[2].name)            
            done()
        })
    })


    it('get team and config', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let teamConfigService = new TeamConfigService()
        let league = new League('league1')
        let team = new Team('adelaide')
        let config = new TeamConfig({
            homeGamesMin: 1,
            homeGamesMax: 2,
            awayGamesMin: 3,
            awayGamesMax: 4,
        })
        leagueService.addLeague(league).then((l) => {
            league = l
            team.setLeague(league)
            return teamService.addTeam(team)
        }).then((l) => {
            team = l
            config.setTeam(team)
            return teamConfigService.addTeamConfig(config)
        }).then(() => {
            return teamService.getTeamAndConfig(team.id)
        }).then((l) => {
            expect(l.name).toBe(team.name)
            expect(l.teamConfigPreLoaded.awayGamesMax).toBe(config.awayGamesMax)
            expect(l.teamConfigPreLoaded.awayGamesMin).toBe(config.awayGamesMin)
            expect(l.teamConfigPreLoaded.homeGamesMax).toBe(config.homeGamesMax)
            expect(l.teamConfigPreLoaded.homeGamesMin).toBe(config.homeGamesMin)
            done()
        })
    })

    it('delete team, 1 team', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let league = new League('league1')
        let team = new Team('adelaide')
        leagueService.addLeague(league).then((l) => {
            league = l
            team.setLeague(league)
            return teamService.addTeam(team)
        }).then(() => {
            return teamService.getTeams(league)
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(team.name)
            return teamService.deleteTeam(team)
        }).then(() => {
            return teamService.getTeams(league)
        }).then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('delete team, 5 team', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let league = new League('league1')
        let teams = [
            new Team('alpha'),
            new Team('bravo'),
            new Team('charlie'),
            new Team('delta'),
            new Team('echo'),
        ]
        leagueService.addLeague(league).then((l) => {
            league = l
            for (let team of teams) {
                team.setLeague(league)
            }
            return Promise.each(teams, (item, index, len) => {
                return teamService.addTeam(item)
            })
        }).then(() => {
            return teamService.getTeams(league)
        }).then((l) => {
            expect(l.toArray().map((val) => {
                return val.name
            })).toEqual(teams.map((val) => {
                return val.name
            }))
            return teamService.deleteTeam(l.toArray()[4])
        }).then((l) => {
            teams.splice(4, 1)
            return teamService.getTeams(league)
        }).then((l) => {
            expect(l.toArray().map((val) => {
                return val.name
            })).toEqual(teams.map((val) => {
                return val.name
            }))
            done()
        })
    })

})
