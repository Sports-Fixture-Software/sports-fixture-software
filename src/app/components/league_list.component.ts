import { Component } from '@angular/core';
import { LeagueService } from '../services/league.service';

@Component({
    moduleId: module.id,
    templateUrl : 'league_list.template.html' ,
    providers: [LeagueService] 
})

export class LeagueListComponent  {
    constructor(private leagueService: LeagueService) { }
}
