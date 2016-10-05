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



console.log("DFS TESTING...");

var testFixture: Match[] = [];
var testTeams: Team[] = [];
var reservedMatches: Match[] = [];

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.log("===== TEST 1: 6 teams, no constraints =====");
testTeams = [
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
];
testFixture = plotFixtureRotation( testTeams, reservedMatches, true );
console.log("Success. Printing fixture:");
for( var i: number = 0; i < testFixture.length; i++ ){
    console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.log("===== TEST 2: 6 teams, two reserved games =====");
testTeams = [
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
];
reservedMatches = [
    new Match(0,0,1),
    new Match(1,0,2)
];
testFixture = plotFixtureRotation( testTeams, reservedMatches, true );
console.log("Success. Printing fixture:");
for( var i: number = 0; i < testFixture.length; i++ ){
    console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
}

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

console.log("===== TEST 3: 6 teams, full reserved games =====");
testTeams = [
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints(),
    new TestTeamNoConstraints(), new TestTeamNoConstraints(), new TestTeamNoConstraints()
];
reservedMatches = [ // This should break as it is not a legal setup
    new Match(0,0,1), new Match(0,2,5), new Match(0,3,4),
    new Match(1,0,2), new Match(1,1,3), new Match(1,5,4),
    new Match(2,2,4), new Match(2,0,3), new Match(2,1,5),
    new Match(3,5,0), new Match(3,3,2), new Match(3,4,1), 
    new Match(4,0,4), new Match(4,5,3), new Match(4,1,2)  
];
testFixture = plotFixtureRotation( testTeams, reservedMatches, true );
console.log("Success. Printing fixture:");
for( var i: number = 0; i < testFixture.length; i++ ){
    console.log("Round " + testFixture[i].roundNum + ": H" + testFixture[i].homeTeam + " vs. A" + testFixture[i].awayTeam);
}
