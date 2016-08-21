import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { Fixture } from '../models/fixture'

@Component({
    selector: '[fixture-list-item]',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'fixture_list_item.template.html'
})
export class FixtureListItem implements OnInit {
    @Input('fixture-list-item') fixture: Fixture;
    
    constructor() {
    }

    ngOnInit() {        
    }
}
