import { Constraint } from '../../../util/constraint_factory'
import { Team as DFSTeam, Match as DFSMatch, FixtureInterface }  from './fixture_constraints'

export class TeamConstraints implements DFSTeam {

    constructor() { }

    constraintsSatisfied(fixture: FixtureInterface, proposedMatch: DFSMatch, home: boolean): Constraint {
        return Constraint.SATISFIED;
    }
}
