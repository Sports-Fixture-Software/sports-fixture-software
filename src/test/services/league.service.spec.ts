import { databaseInjector } from '../../app/services/database_injector'
import { DatabaseService } from '../../app/services/database.service'
import { LeagueService } from '../../app/services/league.service'
import { FixtureService } from '../../app/services/fixture.service'
import { TeamService } from '../../app/services/team.service'
import { LeagueConfigService } from '../../app/services/league_config.service'
import { AppConfig } from '../../app/util/app_config'
import { League } from '../../app/models/league'
import { Fixture } from '../../app/models/fixture'
import { Team } from '../../app/models/team'
import { LeagueConfig } from '../../app/models/league_config'
import * as Promise from 'bluebird'

/**
 * Unit tests for the LeagueService
 */
describe('services LeagueService', () => {
    beforeEach((done) => {
        let databaseService = databaseInjector.get(DatabaseService)
        databaseService.cleanDatabase().then(() => {
            return databaseService.init()
        }).then(() => {
            done()
        })
    })

    it('get leagues, no leagues', (done) => {
        let leagueService = new LeagueService()
        leagueService.getLeagues().then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('get leagues, 1 league', (done) => {
        let leagueService = new LeagueService()
        let league = new League('alpha')
        leagueService.addLeague(league).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(league.name)
            done()
        })
    })

    it('get leagues by id', (done) => {
        let leagueService = new LeagueService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(5)
            return leagueService.getLeague(l.toArray()[4].id)
        }).then((l) => {
            expect(l.name).toBe(leagues[4].name)
            done()
        })
    })

    it('get league and fixtures', (done) => {
        let leagueService = new LeagueService()
        let fixtureService = new FixtureService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        let fixtures = [
            new Fixture('fixture 1'),
            new Fixture('fixture 1'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            expect(l.toArray().length).toBe(5)
            for (let fixture of fixtures) {
                fixture.setLeague(l.toArray()[2])
            }
            return Promise.each(fixtures, (item, index, len) => {
                return fixtureService.addFixture(item)
            })
        }).then(() => {
            return leagueService.getLeagueAndFixtures(leagues[2].id)
        }).then((l) => {
            expect(l.name).toBe(leagues[2].name)
            expect(l.fixturesPreLoaded.toArray().map((val) => {
                return val.name
            })).toEqual(fixtures.map((val) => {
                return val.name
            }))
            done()
        })
    })

    it('get league and teams', (done) => {
        let leagueService = new LeagueService()
        let teamService = new TeamService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        let teams = [
            new Team('adelaide'),
            new Team('port'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            expect(l.toArray().length).toBe(5)
            for (let team of teams) {
                team.setLeague(l.toArray()[1])
            }
            return Promise.each(teams, (item, index, len) => {
                return teamService.addTeam(item)
            })
        }).then(() => {
            return leagueService.getLeagueAndTeams(leagues[1].id)
        }).then((l) => {
            expect(l.name).toBe(leagues[1].name)
            expect(l.teamsPreLoaded.toArray().map((val) => {
                return val.name
            })).toEqual(teams.map((val) => {
                return val.name
            }))
            done()
        })
    })

    it('get league and config', (done) => {
        let leagueService = new LeagueService()
        let leagueConfigService = new LeagueConfigService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        let leagueConfig = new LeagueConfig(
            {
                consecutiveHomeGamesMax: 2,
                consecutiveAwayGamesMax: 3
            })
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            expect(l.toArray().length).toBe(5)
            leagueConfig.setLeague(leagues[3])
            return leagueConfigService.addLeagueConfig(leagueConfig)
        }).then(() => {
            return leagueService.getLeagueAndConfig(leagues[3].id)
        }).then((l) => {
            expect(l.name).toBe(leagues[3].name)
            expect(l.leagueConfigPreLoaded.consecutiveHomeGamesMax).toBe(leagueConfig.consecutiveHomeGamesMax)
            expect(l.leagueConfigPreLoaded.consecutiveAwayGamesMax).toBe(leagueConfig.consecutiveAwayGamesMax)
            done()
        })
    })

    it('update league', (done) => {
        let leagueService = new LeagueService()
        let league = new League('alpha')
        leagueService.addLeague(league).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(league.name)
            league.name = 'bravo'
            return leagueService.updateLeague(league)
        }).then((l) => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(league.name)
            done()
        })
    })

    it('delete league, 1 league', (done) => {
        let leagueService = new LeagueService()
        let league = new League('alpha')
        leagueService.addLeague(league).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(league.name)
            return leagueService.deleteLeague(league)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('delete league, 5 leagues', (done) => {
        let leagueService = new LeagueService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(5)
            expect(l.toArray().map((val) => {
                return val.name
            })).toEqual(leagues.map((val) => {
                return val.name
            }))
            return leagueService.deleteLeague(leagues[2])
        }).then(() => {
            leagues.splice(2, 1)
            return leagueService.getLeagues()
        }).then((l) => {
            expect(l.toArray().length).toBe(4)
            expect(l.toArray().map((val) => {
                return val.name
            })).toEqual(leagues.map((val) => {
                return val.name
            }))
            done()
        })
    })

})
