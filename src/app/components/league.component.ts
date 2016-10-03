import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, ROUTER_DIRECTIVES, Params } from '@angular/router';
import { Subscription } from 'rxjs/subscription';

import { League } from '../models/league';
import { LeagueService } from '../services/league.service';
import { Collection }  from '../services/collection'
import { Navbar } from './navbar.component';
import { BreadcrumbService, Breadcrumb } from '../services/breadcrumb.service';

import { POPOVER_DIRECTIVES } from 'ng2-popover';
import { MODAL_DIRECTIVES, ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league.template.html',
    providers: [LeagueService], 
    directives: [Navbar, POPOVER_DIRECTIVES, MODAL_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class LeagueComponent implements OnInit, OnDestroy {
    private league: League;
    private routeSubscription: Subscription;

    constructor(private router: Router,
                public route: ActivatedRoute,
                private leagueService: LeagueService,
                private changeref: ChangeDetectorRef,
                private breadcrumbService: BreadcrumbService) {
    }
    
    ngOnInit() { 
        this.routeSubscription = this.route.params.subscribe(params => {
            let id = +params['id'];
            this.leagueService.getLeague(id).then(league => {
                this.league = league;
                
                this.breadcrumbService.setBreadcrumbs([
                    new Breadcrumb("Leagues", ["/"]),
                    new Breadcrumb(this.league.name, ['/league', this.league.id])
                ]);
            }).then(() => {
                this.changeref.detectChanges();
            });
        });
     }

     ngOnDestroy() {
         this.routeSubscription.unsubscribe();
     }
}