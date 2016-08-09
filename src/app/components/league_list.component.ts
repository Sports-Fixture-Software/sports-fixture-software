import { Component } from '@angular/core';
import { LeagueService } from '../services/league.service';
import * as sqlite from 'sqlite3';

@Component({
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl : 'league_list.template.html',
    providers: [LeagueService] 
})

export class LeagueListComponent  {
    private db : sqlite.Database
    private dbFilename : string = 'sanfl_fixture_software.database'; 

    // TODO: error handling on database open/create
    // TODO: database filename from a configuration file
    constructor(private leagueService: LeagueService) {
        this.db = new sqlite.Database(this.dbFilename, (err: Error) => {
            if (err) {
                throw `Unable to open database '${this.dbFilename}'.`
            }
        })
     }
}
