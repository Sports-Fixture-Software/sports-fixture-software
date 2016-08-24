import { Component, OnInit, Input } from '@angular/core'
import { Team } from '../models/team'

@Component({
    selector: 'team-list-item',
    moduleId: module.id.replace(/\\/g, '/'),
    templateUrl: 'team_list_item.template.html'
})
export class TeamListItem implements OnInit {
    @Input() team: Team;

    constructor() {
    }

    ngOnInit() {
    }

}
