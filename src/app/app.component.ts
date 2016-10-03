import { Component } from '@angular/core';
import { ROUTER_DIRECTIVES } from '@angular/router';
import { BreadcrumbService } from './services/breadcrumb.service';

@Component({
    selector: 'app',
    template: `<router-outlet></router-outlet>`,
    providers: [BreadcrumbService], 
    directives: [ROUTER_DIRECTIVES]
})
export class AppComponent{
    constructor() { }
}
