/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { NotifyService, GenerateState } from '../services/notify.service';
import { Fixture } from '../models/fixture';
import { FixtureService } from '../services/fixture.service';
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
        private changeref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['id']
            this.fixtureService.getFixture(id).then(fixture => {
                this.fixture = fixture
                this.canReview = fixture.generatedOn.isValid()
                this.changeref.detectChanges()
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
