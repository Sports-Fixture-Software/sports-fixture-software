///<reference path="../../typings/index.d.ts" />

import { DatabaseService } from './services/database.service'
import { ReflectiveInjector, Injector } from '@angular/core'
export let databaseInjector: Injector = ReflectiveInjector.resolveAndCreate([DatabaseService])

import { bootstrap }    from '@angular/platform-browser-dynamic';
import { AppComponent } from './app.component';
import { APP_ROUTER_PROVIDERS } from './app.routes';
import { LocationStrategy,
         HashLocationStrategy } from '@angular/common';

bootstrap(AppComponent, [
    APP_ROUTER_PROVIDERS,
    { provide: LocationStrategy, useClass: HashLocationStrategy } // Use hash location strategy to play nice with electron's filesystem URLs
]);
