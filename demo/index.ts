import { plotFixtureRotation } from './dfsFixtureDemo';
import { Match, Constraint, FixtureInterface, Team } from './FixtureConstraints';


/**
 * The following is test driver code for the dfsFixtureDemo function
 */

// TEAM IMPLEMENTATION CLASSES W. DUMMY CONSTRAINTS
class TestTeamNoConstraints implements Team {
    
    constructor( public index: number ){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}

class TestTeamMaxHome implements Team {
    
    constructor( public index: number ){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}

class TestTeamMinAway implements Team {
    
    constructor( public index: number ){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}

class TestTeamMaxConsecAwayAndHome implements Team {
    
    constructor( public index: number ){}

    // HASHMAP TO STORE TEAM LEVEL CONSTRAINTS
    // HASHMAP TO STORE FIXTURE LEVEL CONSTRAINTS
    // HASHMAP TO STORE LEAGUE LEVEL CONSTRAINTS

    constraintsSatisfied( fixture: FixtureInterface, proposedMatch: Match ): Constraint {
        // Run through hashmaps to check that constraints are satisfied

        return Constraint.SATISFIED;
    } 
}

// DRIVER TO TEST THE plotFixtureRotation FUNCTION

var testTeams: TestTeam[] = {
    // POPULATE WITH A VARIETY OF DUMMY TEAMS WITH DIFFERENT CONSTRAINTS
    // MAKE SURE THAT INDICES ARE CORRECT
}

var reservedMatches: Match[] = [
    new Match(0,0,1),
    new Match(1,0,2)
]

console.log("DFS TESTING...");

var testFixture: Match[];
try {
    testFixture = plotFixtureRotation( testTeams, reservedMatches );
} catch (e){
    console.log("ERROR: " + e./* WHAT'S THE MEMBER OF AN ERROR? MSG? MESSAGE? TOSTRING? */);
}

console.log("Printing fixture:");

for( var i: number = 0; i < testFixture.length; i++ ){
    console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
}
