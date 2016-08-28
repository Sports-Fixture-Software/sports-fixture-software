import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/subscription';

import { Fixture } from '../models/fixture';
import { FixtureService } from '../services/fixture.service';
import { Collection }  from '../services/collection'
import { Navbar } from './navbar.component';

import { POPOVER_DIRECTIVES } from 'ng2-popover';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league.template.html',
    providers: [FixtureService], 
    directives: [Navbar, POPOVER_DIRECTIVES, MODAL_DIRECTIVES, ROUTER_DIRECTIVES]
})
    
export class FixtureComponent implements OnInit, OnDestroy {
    private fixture: Fixture
    private routeSubscription: Subscription

    constructor(private router: Router,
                public route: ActivatedRoute,
                private fixtureService: FixtureService,
                private changeref: ChangeDetectorRef) {
    }
    
    ngOnInit() { 
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['id']
            this.fixtureService.getFixture(id).then(fixture => {
                this.fixture = fixture
                this.changeref.detectChanges()
            })
        });
     }

     ngOnDestroy() {
         this.routeSubscription.unsubscribe()
     }
}
