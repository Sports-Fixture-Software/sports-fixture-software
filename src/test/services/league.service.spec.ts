import { ReflectiveInjector, Injectable } from '@angular/core'
import { LeagueService } from '../../app/services/league.service'
//      @Injectable()
//      class Engine {
//      }

export function main() {
    let service: LeagueService
    beforeAll(() => {
        let providers = ReflectiveInjector.resolve([LeagueService])
        let injector = ReflectiveInjector.fromResolvedProviders(providers)

    //  expect(injector.get(Car) instanceof Car).toBe(true);        let injector: ReflectiveInjector = ReflectiveInjector.resolveAndCreate([LeagueService])
        service = injector.get(LeagueService)
    })

    describe('league service', () => {
        it('initialise', () => {
            expect(service).toBeDefined()
            expect(service).toEqual(jasmine.any(LeagueService))
        })
    })
}
class TestLeagueService { }

//import * as Promise from 'bluebird'
// import * as events from 'events'
// export function main() {
//     describe('promise service', () => {
// //        let promise = new Promise<number>((resolve, reject) => { resolve(42) })
//         it('promise', () => {
//             let ee = new events.EventEmitter()
//             expect(ee).toBeDefined()
//             expect(ee).toEqual(jasmine.any(events.EventEmitter))
//         })
//     })
// }
