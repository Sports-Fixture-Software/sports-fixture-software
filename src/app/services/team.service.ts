import { League } from '../models/league';
import { Team } from '../models/team';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class TeamService {

    getTeams(leagueId?: number): Promise<Collection<Team>> {
        if (leagueId) {
            return new Team().where('league_id', leagueId).fetchAll()
        } else {
            return new Team().fetchAll()
        }
    }

    getTeam(id: number): Promise<Team> {
        return new Team().where('id', id).fetch()
    }

    addTeam(team: Team): Promise<Team> {
        return team.save()
    }

    /**
     * returns an empty Team
     */
    deleteTeam(team: Team): Promise<Team> {
        return team.destroy()
    }

    /**
     * Count the number of teams in a single league
     */
    countTeams(league: League) : Promise<number> {
        return new Team().where('league_id', league.id).count()
    }
}
