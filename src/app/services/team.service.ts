/**
 * Copyright (c) 2016 Michael Humphris, Craig Keogh, and Louis Griffith
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to 
 * deal in the Software without restriction, including without limitation the 
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or 
 * sell copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in 
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING 
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */

import { League } from '../models/league';
import { Team } from '../models/team';
import { Collection } from './collection'
import { Injectable } from '@angular/core'
import * as Promise from 'bluebird'

@Injectable()
export class TeamService {

    getTeams(league?: League): Promise<Collection<Team>> {
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
        return new Team().where({'league_id': league.id, 'active': true}).count()
    }
}
