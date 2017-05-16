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

import { Constraint, ConstraintFactory, ConstrCheck, FixtureInterface } from '../../../util/constraint_factory'
import { Team as DFSTeam, Match as DFSMatch }  from './fixture_constraints'
import { TeamConstraintInfo, LeagueFixtureConstraintInfo } from '../scheduler.service'

export class TeamConstraints implements DFSTeam {

    constructor(teamid: number, teamConstraint: TeamConstraintInfo, leagueFixtureConstraint: LeagueFixtureConstraintInfo) {
        let factory = new ConstraintFactory()
        if (teamConstraint.maxHome != null && teamConstraint.maxHome != undefined && teamConstraint.maxHome != -1) {
            this.constraints.push({
                check: factory.createMaxHome(teamid, teamConstraint.maxHome),
                constraint: Constraint.MAX_HOME
            })
        }
        if (teamConstraint.maxAway != null && teamConstraint.maxAway != undefined && teamConstraint.maxAway != -1) {
            this.constraints.push({
                check: factory.createMaxAway(teamid, teamConstraint.maxAway),
                constraint: Constraint.MAX_AWAY
            })
        }
        if (leagueFixtureConstraint.consecutiveHomeGamesMax != null && leagueFixtureConstraint.consecutiveHomeGamesMax != undefined && leagueFixtureConstraint.consecutiveHomeGamesMax != -1) {
            this.constraints.push({
                check: factory.createMaxConsecHome(leagueFixtureConstraint.consecutiveHomeGamesMax),
                constraint: Constraint.MAX_CONSEC_HOME
            })
        }
        if (leagueFixtureConstraint.consecutiveAwayGamesMax != null && leagueFixtureConstraint.consecutiveAwayGamesMax != undefined && leagueFixtureConstraint.consecutiveAwayGamesMax != -1) {
            this.constraints.push({
                check: factory.createMaxConsecAway(leagueFixtureConstraint.consecutiveAwayGamesMax),
                constraint: Constraint.MAX_CONSEC_AWAY
            })
        }
     }

    constraintsSatisfied(fixture: FixtureInterface, proposedMatch: DFSMatch, home: boolean): Constraint {
        for (let constraint of this.constraints) {
            let result = constraint.check(fixture, proposedMatch)
            if (!result) {
                return constraint.constraint
            }
        }
        return Constraint.SATISFIED;
    }

    private constraints: CheckInfo[] = []
}

interface CheckInfo {
    check: ConstrCheck,
    constraint: Constraint,
}
