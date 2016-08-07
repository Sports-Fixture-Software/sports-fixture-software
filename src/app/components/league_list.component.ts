import { Component } from '@angular/core';
import { LeagueService } from '../services/league.service';
import * as path from 'path';

@Component({
    moduleId: module.id,
    // on Windows templateUrl: 'league_list.template.html', resolves to c:/league_list.template.html
    // which fails.
    templateUrl : path.resolve(path.join(__dirname, 'league_list.template.html')).replace(/\\/g, '/'),
    providers: [LeagueService] 
})

export class LeagueListComponent  {
    constructor(private leagueService: LeagueService) { }
}
