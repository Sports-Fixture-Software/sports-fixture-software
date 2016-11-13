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

import { databaseInjector } from '../services/database_injector'
import { DatabaseService } from '../services/database.service'
import { Round } from './round'
import { Team } from './team'
import * as Promise from 'bluebird'

export class Match extends (databaseInjector.get(DatabaseService) as DatabaseService).Model<Match> {

    constructor(params?: any) {
        super(params)
    }

    get tableName() { return 'match' }

    get homeTeam_id(): number { return this.get('homeTeam_id') }
    set homeTeam_id(value: number) { this.set('homeTeam_id', value) }
    get awayTeam_id(): number { return this.get('awayTeam_id') }
    set awayTeam_id(value: number) { this.set('awayTeam_id', value) }

    get homeTeamName(): string {
        if (this.homeTeam_id == Team.BYE_TEAM_ID) {
            return 'Bye'
        } else if (this.homeTeamPreLoaded) {
            return this.homeTeamPreLoaded.name
        } else {
            return 'undefined'
        }
    }
    get awayTeamName(): string {
        if (this.awayTeam_id == Team.BYE_TEAM_ID) {
            return 'Bye'
        } else if (this.awayTeamPreLoaded) {
            return this.awayTeamPreLoaded.name
        } else {
            return 'undefined'
        }
    }

    setRound(value: Round) { this.set('round_id', value.id) }
    set round_id(value: number) { this.set('round_id', value) }

    get homeTeamPreLoaded(): Team {
        return this.related('homeTeam') as Team
    }
    setHomeTeam(value: Team) { this.set('homeTeam_id', value.id) }

    get awayTeamPreLoaded(): Team {
        return this.related('awayTeam') as Team
    }
    setAwayTeam(value: Team) { this.set('awayTeam_id', value.id) }

    /**
     * Needed by bookshelf to setup relationship
     */
    protected round() {
        return this.belongsTo(Round)
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected homeTeam() {
        return this.belongsTo(Team, 'homeTeam_id')
    }
    /**
     * Needed by bookshelf to setup relationship
     */
    protected awayTeam() {
        return this.belongsTo(Team, 'awayTeam_id')
    }
}
