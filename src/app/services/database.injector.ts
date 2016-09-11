import { DatabaseService } from './database.service'
import { ReflectiveInjector, Injector } from '@angular/core'
export let databaseInjector: Injector = ReflectiveInjector.resolveAndCreate([DatabaseService])
