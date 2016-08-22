import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/subscription';

import { League } from '../models/league';
import { LeagueService } from '../services/league.service';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    template : `<h2>League Details</h2>
                League Name: {{ league?.name }}`
})
export class LeagueDetailsComponent implements OnInit, OnDestroy {
    private league: League;
    private routeSubscription: Subscription;

    constructor(private route: ActivatedRoute,
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