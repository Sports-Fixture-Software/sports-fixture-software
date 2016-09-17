import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NotifyService } from '../services/notify.service';
import { Fixture } from '../models/fixture';
import { FixtureService } from '../services/fixture.service';
import { Collection }  from '../services/collection'
import { Navbar } from './navbar.component';

import { POPOVER_DIRECTIVES } from 'ng2-popover';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture.template.html',
    providers: [FixtureService, NotifyService],
    directives: [Navbar, POPOVER_DIRECTIVES, MODAL_DIRECTIVES, ROUTER_DIRECTIVES]
})

export class FixtureComponent implements OnInit, OnDestroy {
    private fixture: Fixture
    private routeSubscription: Subscription
    private generatedSubscription: Subscription

    constructor(private router: Router,
        public route: ActivatedRoute,
        private fixtureService: FixtureService,
        private notifyService: NotifyService,
        private changeref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['id']
            this.fixtureService.getFixture(id).then(fixture => {
                this.fixture = fixture
                this.changeref.detectChanges()
            })
        })
        this.generatedSubscription = this.notifyService.generated$.subscribe((value) => {
            // if receive notification via the notify service that the fixture
            // has been generated, reload the fixture, so the review button
            // becomes active.
            if (this.fixture) {
                this.fixtureService.getFixture(this.fixture.id).then((fixture) => {
                    this.fixture = fixture
                    this.changeref.detectChanges()
                })
            }
        })
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe()
        this.generatedSubscription.unsubscribe()
    }
}
