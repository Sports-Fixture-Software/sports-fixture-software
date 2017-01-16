import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NotifyService, GenerateState } from '../services/notify.service';
import { Fixture } from '../models/fixture';
import { FixtureService } from '../services/fixture.service';
import { BreadcrumbService, Breadcrumb } from '../services/breadcrumb.service';
import { Collection } from '../services/collection'

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture.template.html',
    providers: [FixtureService, NotifyService]
})

export class FixtureComponent implements OnInit, OnDestroy {
    private fixture: Fixture
    private routeSubscription: Subscription
    private generateSubscription: Subscription
    private canReview: boolean = false

    constructor(private router: Router,
        public route: ActivatedRoute,
        private fixtureService: FixtureService,
        private notifyService: NotifyService,
        private changeref: ChangeDetectorRef,
        private breadcrumbService: BreadcrumbService) {
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['id']
            this.fixtureService.getFixture(id).then(fixture => {
                this.fixture = fixture

                let league = fixture.leaguePreLoaded;
                this.breadcrumbService.setBreadcrumbs([
                    new Breadcrumb("Leagues", ["/"]),
                    new Breadcrumb(league.name, ['/league', league.id]),
                    new Breadcrumb(this.fixture.name, ['/fixtures', this.fixture.id])
                ])

                this.canReview = fixture.generatedOn.isValid()
            }).then(() => {
                this.changeref.detectChanges();
            })
        })
        
        this.generateSubscription = this.notifyService.generateState$.subscribe((value) => {
            if (value == GenerateState.Generating) {
                this.canReview = false
                // if receive notification via the notify service that the fixture
                // has been generated, make the review button active.
            } else if (value == GenerateState.Generated) {
                this.canReview = true
                this.changeref.detectChanges()
            }
        })
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe()
        this.generateSubscription.unsubscribe()
    }
}
