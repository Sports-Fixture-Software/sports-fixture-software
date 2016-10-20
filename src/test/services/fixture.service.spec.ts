import { databaseInjector } from '../../app/services/database_injector'
import { DatabaseService } from '../../app/services/database.service'
import { LeagueService } from '../../app/services/league.service'
import { FixtureService } from '../../app/services/fixture.service'
import { TeamService } from '../../app/services/team.service'
import { FixtureConfigService } from '../../app/services/fixture_config.service'
import { AppConfig } from '../../app/util/app_config'
import { League } from '../../app/models/league'
import { Fixture } from '../../app/models/fixture'
import { Team } from '../../app/models/team'
import { FixtureConfig } from '../../app/models/fixture_config'
import * as Promise from 'bluebird'

/**
 * Unit tests for the FixtureService
 */
describe('services FixtureService', () => {
    beforeEach((done) => {
        let databaseService = databaseInjector.get(DatabaseService)
        databaseService.cleanDatabase().then(() => {
            return databaseService.init()
        }).then(() => {
            done()
        })
    })

    it('get fixtures, no fixtures', (done) => {
        let fixtureService = new FixtureService()
        fixtureService.getFixtures().then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('get fixtures, 1 fixture', (done) => {
        let leagueService = new LeagueService()
        let fixtureService = new FixtureService()
        let leagues = [
            new League('league1'),
            new League('league2'),
        ]
        let fixture = new Fixture('alpha')
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            fixture.setLeague(leagues[0])
            return fixtureService.addFixture(fixture)
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(fixture.name)
            done()
        })
    })

    it('get fixtures by id', (done) => {
        let leagueService = new LeagueService()
        let fixtureService = new FixtureService()
        let leagues = [
            new League('league1'),
            new League('league2'),
        ]
        let fixtures = [
            new Fixture('alpha'),
            new Fixture('bravo'),
            new Fixture('charlie'),
            new Fixture('delta'),
            new Fixture('echo'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            for (let fixture of fixtures) {
                fixture.setLeague(leagues[1]) 
            }
            return Promise.each(fixtures, (item, index, len) => {
                return fixtureService.addFixture(item)
            })
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            expect(l.toArray().length).toBe(5)
            return fixtureService.getFixture(l.toArray()[4].id)
        }).then((l) => {
            expect(l.name).toBe(fixtures[4].name)
            done()
        })
    })

    it('get fixture and league', (done) => {
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
            new Fixture('fixture 0'),
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
            return fixtureService.getFixtures()
        }).then((l) => {
            fixtures = l.toArray()
            return fixtureService.getFixtureAndLeague(fixtures[1].id)
        }).then((l) => {
            expect(l.name).toBe(fixtures[1].name)
            expect(l.leaguePreLoaded.name).toBe(leagues[2].name)
            done()
        })
    })

    it('get fixture and teams', (done) => {
        let leagueService = new LeagueService()
        let fixtureService = new FixtureService()
        let teamService = new TeamService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        let fixtures = [
            new Fixture('fixture 0'),
            new Fixture('fixture 1'),
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
            expect(leagues.length).toBe(5)
            for (let team of teams) {
                team.setLeague(leagues[1])
            }
            return Promise.each(teams, (item, index, len) => {
                return teamService.addTeam(item)
            })
        }).then(() => {
            for (let fixture of fixtures) {
                fixture.setLeague(leagues[1])
            }
            return Promise.each(fixtures, (item, index, len) => {
                return fixtureService.addFixture(item)
            })
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            fixtures = l.toArray()
            return fixtureService.getFixtureAndTeams(fixtures[0].id)
        }).then((l) => {
            expect(l.name).toBe(fixtures[0].name)
            expect(l.leaguePreLoaded.name).toBe(leagues[1].name)
            expect(l.leaguePreLoaded.teamsPreLoaded.toArray().map((val => {
                return val.name
            }))).toEqual(teams.map((val) => {
                return val.name
            }))
            done()
        })
    })

    it('get fixture and league and config', (done) => {
        let leagueService = new LeagueService()
        let fixtureService = new FixtureService()
        let fixtureConfigService = new FixtureConfigService()
        let leagues = [
            new League('alpha'),
            new League('bravo'),
            new League('charlie'),
            new League('delta'),
            new League('echo'),
        ]
        let fixtures = [
            new Fixture('fixture 0'),
            new Fixture('fixture 1'),
        ]
        let config = new FixtureConfig({
            consecutiveHomeGamesMax: 5,
            consecutiveAwayGamesMax: 7,
        })
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            for (let fixture of fixtures) {
                fixture.setLeague(leagues[2])
            }
            return Promise.each(fixtures, (item, index, len) => {
                return fixtureService.addFixture(item)
            })
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            fixtures = l.toArray()
            config.setFixture(fixtures[0])
            return fixtureConfigService.addFixtureConfig(config)
        }).then(() => {
            return fixtureService.getFixtureAndLeagueAndConfig(fixtures[0].id)
        }).then((l) => {
            expect(l.name).toBe(fixtures[0].name)
            expect(l.leaguePreLoaded.name).toBe(leagues[2].name)
            expect(l.fixtureConfigPreLoaded.consecutiveAwayGamesMax).toBe(config.consecutiveAwayGamesMax)
            expect(l.fixtureConfigPreLoaded.consecutiveHomeGamesMax).toBe(config.consecutiveHomeGamesMax)
            done()
        })
    })

    it('delete fixture, 1 fixture', (done) => {
        let fixtureService = new FixtureService()
        let leagueService = new LeagueService()
        let fixture = new Fixture('alpha')
        let leagues = [
            new League('league1'),
            new League('league2'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            fixture.setLeague(leagues[0])
            return fixtureService.addFixture(fixture)
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            expect(l.toArray().length).toBe(1)
            expect(l.toArray()[0].name).toBe(fixture.name)
            return fixtureService.deleteFixture(fixture)
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            expect(l.toArray().length).toBe(0)
            done()
        })
    })

    it('delete fixture, 5 fixtures', (done) => {
        let fixtureService = new FixtureService()
        let leagueService = new LeagueService()
        let fixtures = [
            new Fixture('alpha'),
            new Fixture('bravo'),
            new Fixture('charlie'),
            new Fixture('delta'),
            new Fixture('echo'),
        ]
        let leagues = [
            new League('league1'),
            new League('league2'),
        ]
        Promise.each(leagues, (item, index, len) => {
            return leagueService.addLeague(item)
        }).then(() => {
            return leagueService.getLeagues()
        }).then((l) => {
            leagues = l.toArray()
            for (let fixture of fixtures) {
                fixture.setLeague(leagues[0])
            }
            return Promise.each(fixtures, (item, index, len) => {
                return fixtureService.addFixture(item)
            })
        }).then(() => {
            return fixtureService.getFixtures()
        }).then((l) => {
            expect(l.toArray().length).toBe(5)
            expect(l.toArray().map((val) => {
                return val.name    
            })).toEqual(fixtures.map((val) => {
                return val.name
            }))
            return fixtureService.deleteFixture(fixtures[3])
        }).then(() => {
            fixtures.splice(3, 1)
            return fixtureService.getFixtures()
        }).then((l) => {
            expect(l.toArray().length).toBe(4)
            expect(l.toArray().map((val) => {
                return val.name    
            })).toEqual(fixtures.map((val) => {
                return val.name
            }))
            done()
        })
    })

})
