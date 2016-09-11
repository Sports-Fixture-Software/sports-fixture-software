///<reference path="../../typings/index.d.ts" />

import { DatabaseService } from './services/database.service'
import { databaseInjector } from './services/database.injector'

import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import { LocationStrategy,
         HashLocationStrategy } from '@angular/common';
import { disableDeprecatedForms, provideForms } from '@angular/forms';

let dbs: DatabaseService = databaseInjector.get(DatabaseService)
dbs.init().then(() => {
    bootstrap(AppComponent, [
        APP_ROUTER_PROVIDERS,
        disableDeprecatedForms(),
        provideForms(),
        { provide: LocationStrategy, useClass: HashLocationStrategy } // Use hash location strategy to play nice with electron's filesystem URLs
    ])
});
