import { Component, OnInit, Input } from '@angular/core'
import { Router } from '@angular/router'
import { League } from '../models/league'

@Component({
    selector: '[league-list-item]',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'league_list_item.template.html'
})
export class LeagueListItem implements OnInit {
    @Input('league-list-item') league: League;
    
    constructor(private _router: Router) {
    }

    ngOnInit() {        
    }

    selectLeague(league: League) {
        this._router.navigate(['league', league.id])
    }
}
