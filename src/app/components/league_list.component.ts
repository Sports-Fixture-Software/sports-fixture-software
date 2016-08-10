import { Component } from '@angular/core';
import { LeagueService } from '../services/league.service';
import * as path from 'path';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    providers: [LeagueService] 
})

export class LeagueListComponent  {
    constructor(private leagueService: LeagueService) { }
}
