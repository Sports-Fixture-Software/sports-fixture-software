import { ConstraintFactory, ConstrCheck } from '../../app/util/constraint_factory'
import { Match, FixtureInterface, ConTable } from '../../app/services/scheduler/dfs/fixture_constraints'

/**
 * Unit tests for the util ConstraintFactory
 */
describe('constraint factory', () => {
    it('contable', () => {
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 2, 0))
        ct.setMatch(new Match(1, 2, 1))
        ct.setMatch(new Match(2, 2, 3))
        expect(ct.getAwayTeamVs(0, 2)).toBe(0)
        expect(ct.getAwayTeamVs(1, 2)).toBe(1)
        expect(ct.getAwayTeamVs(2, 2)).toBe(3)
    })

    /* home constraint */

    it('4 teams, 3 round, 2 matches, home constraint (2) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 1, 2))
        let result = constraintMaxHome(ct, new Match(2, 2, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 2 matches, home constraint (2) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 2, 0))
        ct.setMatch(new Match(1, 2, 1))
        let result = constraintMaxHome(ct, new Match(2, 2, 3))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 3, 2))
        ct.setMatch(new Match(0, 1, 0))
        ct.setMatch(new Match(1, 0, 3))
        ct.setMatch(new Match(1, 1, 2))
        let result = constraintMaxHome(ct, new Match(2, 3, 1))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 3, 2))
        ct.setMatch(new Match(0, 1, 0))
        ct.setMatch(new Match(1, 0, 3))
        ct.setMatch(new Match(1, 1, 2))
        let result = constraintMaxHome(ct, new Match(2, 1, 3))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on first round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(1, 0, 3))
        ct.setMatch(new Match(1, 2, 1))
        ct.setMatch(new Match(2, 1, 0))
        ct.setMatch(new Match(2, 2, 3))
        let result = constraintMaxHome(ct, new Match(0, 0, 2))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on first round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(1, 0, 3))
        ct.setMatch(new Match(1, 2, 1))
        ct.setMatch(new Match(2, 1, 0))
        ct.setMatch(new Match(2, 2, 3))
        let result = constraintMaxHome(ct, new Match(0, 2, 0))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on second round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(2, 1, 3))
        ct.setMatch(new Match(2, 0, 2))
        let result = constraintMaxHome(ct, new Match(1, 0, 1))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on second round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 0, 3))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(2, 1, 3))
        ct.setMatch(new Match(2, 0, 2))
        let result = constraintMaxHome(ct, new Match(1, 0, 1))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, home constraint (3) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 4, 0))
        ct.setMatch(new Match(0, 1, 3))
        ct.setMatch(new Match(0, 2, 5))
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 2, 0))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 2, 3))
        let result = constraintMaxHome(ct, new Match(4, 0, 3))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, home constraint (3) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 4, 0))
        ct.setMatch(new Match(0, 1, 3))
        ct.setMatch(new Match(0, 2, 5))
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 0, 2))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 2, 3))
        let result = constraintMaxHome(ct, new Match(4, 0, 3))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, home constraint (3) on first round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 2, 0))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 3, 2))
        ct.setMatch(new Match(4, 2, 1))
        ct.setMatch(new Match(4, 0, 3))
        ct.setMatch(new Match(4, 5, 4))
        let result = constraintMaxHome(ct, new Match(0, 2, 1))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, home constraint (3) on first round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 2, 0))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 2, 3))
        ct.setMatch(new Match(4, 2, 1))
        ct.setMatch(new Match(4, 0, 3))
        ct.setMatch(new Match(4, 5, 4))
        let result = constraintMaxHome(ct, new Match(0, 2, 1))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, home constraint (3) on second round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 5, 4))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(2, 1, 4))
        ct.setMatch(new Match(2, 5, 0))
        ct.setMatch(new Match(2, 3, 2))
        ct.setMatch(new Match(3, 5, 1))
        ct.setMatch(new Match(3, 4, 3))
        ct.setMatch(new Match(3, 0, 2))
        ct.setMatch(new Match(4, 5, 2))
        ct.setMatch(new Match(4, 3, 1))
        ct.setMatch(new Match(4, 4, 0))
        let result = constraintMaxHome(ct, new Match(1, 3, 5))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, home constraint (3) on second round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 5, 4))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(2, 1, 4))
        ct.setMatch(new Match(2, 5, 0))
        ct.setMatch(new Match(2, 3, 2))
        ct.setMatch(new Match(3, 5, 1))
        ct.setMatch(new Match(3, 3, 4))
        ct.setMatch(new Match(3, 0, 2))
        ct.setMatch(new Match(4, 5, 2))
        ct.setMatch(new Match(4, 3, 1))
        ct.setMatch(new Match(4, 4, 0))
        let result = constraintMaxHome(ct, new Match(1, 3, 5))
        expect(result).toBe(false)
    })

    /* away constraint */

    it('4 teams, 3 round, 2 matches, away constraint (2) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 1, 2))
        let result = constraintMaxAway(ct, new Match(2, 2, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 2 matches, away constraint (2) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 2, 0))
        ct.setMatch(new Match(1, 1, 0))
        let result = constraintMaxAway(ct, new Match(2, 3, 0))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(1, 0, 2))
        ct.setMatch(new Match(1, 3, 1))
        let result = constraintMaxAway(ct, new Match(2, 1, 0))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(1, 0, 2))
        ct.setMatch(new Match(1, 3, 1))
        let result = constraintMaxAway(ct, new Match(2, 0, 1))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on first round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(1, 0, 3))
        ct.setMatch(new Match(1, 2, 1))
        ct.setMatch(new Match(2, 1, 0))
        ct.setMatch(new Match(2, 2, 3))
        let result = constraintMaxAway(ct, new Match(0, 3, 1))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on first round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(1, 0, 3))
        ct.setMatch(new Match(1, 2, 1))
        ct.setMatch(new Match(2, 1, 0))
        ct.setMatch(new Match(2, 2, 3))
        let result = constraintMaxAway(ct, new Match(0, 1, 3))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on second round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(2, 1, 3))
        ct.setMatch(new Match(2, 0, 2))
        let result = constraintMaxAway(ct, new Match(1, 3, 2))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on second round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4)
        ct.setMatch(new Match(0, 0, 3))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(2, 1, 3))
        ct.setMatch(new Match(2, 0, 2))
        let result = constraintMaxAway(ct, new Match(1, 2, 3))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, away constraint (3) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 4, 0))
        ct.setMatch(new Match(0, 1, 3))
        ct.setMatch(new Match(0, 2, 5))
        ct.setMatch(new Match(1, 3, 4))
        ct.setMatch(new Match(1, 2, 0))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 2, 3))
        let result = constraintMaxAway(ct, new Match(4, 0, 3))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, away constraint (3) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 4, 0))
        ct.setMatch(new Match(0, 1, 3))
        ct.setMatch(new Match(0, 2, 5))
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 0, 2))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 2, 3))
        let result = constraintMaxAway(ct, new Match(4, 0, 3))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, away constraint (3) on first round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 2, 0))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 3, 2))
        ct.setMatch(new Match(4, 2, 1))
        ct.setMatch(new Match(4, 0, 3))
        ct.setMatch(new Match(4, 5, 4))
        let result = constraintMaxAway(ct, new Match(0, 1, 3))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, away constraint (3) on first round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(1, 4, 3))
        ct.setMatch(new Match(1, 2, 0))
        ct.setMatch(new Match(1, 1, 5))
        ct.setMatch(new Match(2, 2, 4))
        ct.setMatch(new Match(2, 0, 1))
        ct.setMatch(new Match(2, 5, 3))
        ct.setMatch(new Match(3, 1, 4))
        ct.setMatch(new Match(3, 0, 5))
        ct.setMatch(new Match(3, 2, 3))
        ct.setMatch(new Match(4, 2, 1))
        ct.setMatch(new Match(4, 0, 3))
        ct.setMatch(new Match(4, 5, 4))
        let result = constraintMaxAway(ct, new Match(0, 1, 3))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, away constraint (3) on second round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 5, 4))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(2, 1, 4))
        ct.setMatch(new Match(2, 5, 0))
        ct.setMatch(new Match(2, 3, 2))
        ct.setMatch(new Match(3, 5, 1))
        ct.setMatch(new Match(3, 4, 3))
        ct.setMatch(new Match(3, 0, 2))
        ct.setMatch(new Match(4, 5, 2))
        ct.setMatch(new Match(4, 3, 1))
        ct.setMatch(new Match(4, 4, 0))
        let result = constraintMaxAway(ct, new Match(1, 3, 5))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, away constraint (3) on second round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(3)
        let ct = new ConTable(6)
        ct.setMatch(new Match(0, 5, 4))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(0, 3, 0))
        ct.setMatch(new Match(2, 1, 4))
        ct.setMatch(new Match(2, 5, 0))
        ct.setMatch(new Match(2, 3, 2))
        ct.setMatch(new Match(3, 5, 1))
        ct.setMatch(new Match(3, 3, 4))
        ct.setMatch(new Match(3, 0, 2))
        ct.setMatch(new Match(4, 5, 2))
        ct.setMatch(new Match(4, 3, 1))
        ct.setMatch(new Match(4, 4, 0))
        let result = constraintMaxAway(ct, new Match(1, 2, 4))
        expect(result).toBe(false)
    })

})