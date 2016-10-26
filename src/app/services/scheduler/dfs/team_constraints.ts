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
