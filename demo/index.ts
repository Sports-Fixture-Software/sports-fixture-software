import { plotFixtureRotation } from './dfsFixtureDemo';
import { Match, Constraint, FixtureInterface, Team } from './FixtureConstraints';


/**
 * The following is test driver code for the dfsFixtureDemo function
 */

// TEAM IMPLEMENTATION CLASSES W. DUMMY CONSTRAINTS

// No special constraints
class TestTeamNoConstraints implements Team {
    
    constructor(){}

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match, home: boolean ): Constraint {
        return Constraint.SATISFIED;
    }
}

// Maximum home games per rotation
/*class TestTeamMaxHome implements Team {
    
    constructor(){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match, home: boolean ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}*/

// Minimum away games per rotation
/*class TestTeamMinAway implements Team {
    
    constructor(){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match, home: boolean ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}*/

// Maximum consecutive home and away games per rotation
/*class TestTeamMaxConsecAwayAndHome implements Team {
    
    constructor(){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match, home: boolean ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}*/

// DRIVER TO TEST THE plotFixtureRotation FUNCTION

var testTeams: Team[] = [
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
]

var reservedMatches: Match[] = [
    /*new Match(0,0,1),
    new Match(1,0,2)*/
]

console.log("DFS TESTING...");

var testFixture: Match[];

testFixture = plotFixtureRotation( testTeams, reservedMatches );

console.log("Printing fixture:");

for( var i: number = 0; i < testFixture.length; i++ ){
    console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
}
