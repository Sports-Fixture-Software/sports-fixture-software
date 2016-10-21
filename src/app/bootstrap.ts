///<reference path="../../typings/index.d.ts" />
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { databaseInjector } from './services/database_injector'
import { DatabaseService } from './services/database.service'

import { AppModule } from './app.module';

let dbs: DatabaseService = databaseInjector.get(DatabaseService)
dbs.init().then(() => {
    const platform = platformBrowserDynamic();
    platform.bootstrapModule(AppModule);
});
