import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'

import { Fixture } from '../models/fixture'
import { FixtureService } from '../services/fixture.service'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_details.template.html'
})
export class FixtureDetailsComponent implements OnInit {
    private fixture: Fixture;

    constructor(private route: ActivatedRoute,
                private router: Router,
                private fixtureService: FixtureService,
                private changeref: ChangeDetectorRef) {
    }
    
    ngOnInit() { 
        this.router.routerState.parent(this.route)
            .params.forEach(params => {
                let id = +params['id']
                this.fixtureService.getFixture(id).then(fixture => {
                    this.fixture = fixture;
                    this.changeref.detectChanges();
                })
            })
     }
}