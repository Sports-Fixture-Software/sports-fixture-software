///<reference path="../../typings/index.d.ts" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { DatabaseService } from './services/database.service'
import { ReflectiveInjector, Injector } from '@angular/core'
export let databaseInjector: Injector = ReflectiveInjector.resolveAndCreate([DatabaseService])

import { AppModule } from './app.module';

let dbs: DatabaseService = databaseInjector.get(DatabaseService)
dbs.init().then(() => {
    const platform = platformBrowserDynamic();
    platform.bootstrapModule(AppModule);
});




