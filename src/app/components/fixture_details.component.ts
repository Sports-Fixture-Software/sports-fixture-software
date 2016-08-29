import { Component, OnInit, ChangeDetectorRef } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Fixture } from '../models/fixture'
import { FixtureService } from '../services/fixture.service'
import { ButtonPopover } from './button_popover.component'

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_details.template.html',
    directives: [ButtonPopover]
})
export class FixtureDetailsComponent implements OnInit {
    private fixture: Fixture;
    editing : boolean = false

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
                    this.fixture = fixture
                    this.changeref.detectChanges()
                })
            })
     }

     onEditFixture() {
         this.editing = !this.editing
         this.changeref.detectChanges()
     }
}
