import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { LeaguePresenter } from './presenters/league.presenter'

@Component({
    selector: 'app',
    template: `<router-outlet></router-outlet>`,
    providers: [LeaguePresenter],
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent{
    constructor() { }
}
