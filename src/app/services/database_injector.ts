import { ReflectiveInjector, Injector } from '@angular/core'
import { DatabaseService } from './database.service'

export let databaseInjector: Injector = ReflectiveInjector.resolveAndCreate([DatabaseService])
