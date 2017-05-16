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
import { League } from '../models/league';
import { LeagueService } from '../services/league.service';
import { Collection } from '../services/collection'
import { Navbar } from './navbar.component';

import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league.template.html',
    providers: [LeagueService]
})
export class LeagueComponent implements OnInit, OnDestroy {
    private league: League;
    private routeSubscription: Subscription;

    constructor(private router: Router,
        public route: ActivatedRoute,
        private leagueService: LeagueService,
        private changeref: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.leagueService.getLeague(id).then(league => {
                this.league = league;
                this.changeref.detectChanges();
            })
        });
    }

    ngOnDestroy() {
        this.routeSubscription.unsubscribe();
    }
}