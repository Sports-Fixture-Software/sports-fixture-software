import { Component } from '@angular/core';
import { BreadcrumbService } from './services/breadcrumb.service';

@Component({
    selector: 'app',
    template: `<router-outlet></router-outlet>`,
    providers: [BreadcrumbService]
})
export class AppComponent { }
