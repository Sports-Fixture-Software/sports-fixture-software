import { League } from '../models/league';
import { Team } from '../models/team';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class TeamService {

    getTeams(league: League): Promise<Collection<Team>> {
        if (league) {
            return league.fetch({
                withRelated: [
                    {
                        'teams' : (qb) => {
                            return qb.where('active', true)
                        }
                    }]
            }).then((res) => {
                return res.related('teams') as Collection<Team>
            })
        } else {
            return new Team().where('active', true).fetchAll()
        }
    }

    getTeam(id: number): Promise<Team> {
        return new Team().where('id', id).fetch()
    }

    /**
     * get team and the associated team config.
     */
    getTeamAndConfig(id: number): Promise<Team> {
        return new Team().where('id', id).fetch({
            withRelated: ['teamConfig']
        })
    }

    addTeam(team: Team): Promise<Team> {
        return team.save()
    }

    /**
     * returns the deleted team
     */
    deleteTeam(team: Team): Promise<Team> {
        team.set('active', false)
        return team.save()
    }

    /**
     * Count the number of teams in a single league
     */
    countTeams(league: League) : Promise<number> {
        return new Team().where('league_id', league.id).count()
    }
}
