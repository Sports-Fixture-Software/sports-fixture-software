import { Component, OnInit, Input } from '@angular/core';
import { League } from '../models/league';

@Component({
    selector: 'league-list-item',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league_list_item.template.html'
})
export class LeagueListItem implements OnInit {
    @Input() league: League;
    
    constructor() {
    }

    ngOnInit() {        
    }

}
