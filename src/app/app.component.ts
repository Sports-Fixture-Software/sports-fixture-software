import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';


@Component({
    selector: 'app',
    template : `<h1>Welcome to Angular2</h1>
    <nav>
        <a routerLink="/page1" routerLinkAcitve="active">Page 1</a>
        <a routerLink="/page2" routerLinkAcitve="active">Page 2</a>
    </nav>
    <router-outlet></router-outlet>` ,
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent{
    constructor() { }
}
