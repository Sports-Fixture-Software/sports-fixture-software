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

import { ConstraintFactory, ConstrCheck, FixtureInterface } from '../../app/util/constraint_factory'
import { Match, ConTable } from '../../app/services/scheduler/dfs/fixture_constraints'

/**
 * Unit tests for the util ConstraintFactory
 */
describe('constraint factory', () => {
    it('contable', () => {
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 1, 2))
        let result = constraintMaxHome(ct, new Match(2, 2, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 2 matches, home constraint (2) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 2, 0))
        ct.setMatch(new Match(1, 2, 1))
        let result = constraintMaxHome(ct, new Match(2, 2, 3))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, home constraint (2) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxHome = factory.createMaxConsecHome(2)
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 1, 2))
        let result = constraintMaxAway(ct, new Match(2, 2, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, 2 matches, away constraint (2) on last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 2, 0))
        ct.setMatch(new Match(1, 1, 0))
        let result = constraintMaxAway(ct, new Match(2, 3, 0))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, 4 matches, away constraint (2) on last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let constraintMaxAway = factory.createMaxConsecAway(2)
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(4, 3)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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
        let ct = new ConTable(6, 5)
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

    // max home constraint

    it('max home constraint (3) unrelated match (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 3
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 0, 2))
        let result = constraintMaxHome(ct, new Match(2, 1, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max home constraint (3) (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 3
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 0, 2))
        let result = constraintMaxHome(ct, new Match(2, 0, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max home constraint (2) last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 2
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 0, 2))
        let result = constraintMaxHome(ct, new Match(2, 1, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max home constraint (2) last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 2
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 0, 1))
        ct.setMatch(new Match(1, 0, 2))
        let result = constraintMaxHome(ct, new Match(2, 0, 3))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, max home constraint (2) first round (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 2
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(1, 0, 1))
        ct.setMatch(new Match(2, 0, 2))
        let result = constraintMaxHome(ct, new Match(0, 3, 0))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max home constraint (2) first round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 2
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(1, 0, 1))
        ct.setMatch(new Match(2, 0, 2))
        let result = constraintMaxHome(ct, new Match(0, 0, 3))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, max home constraint (2) second round (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 2
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(6, 5)
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
        let result = constraintMaxHome(ct, new Match(1, 0, 1))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, max home constraint (2) second round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxHome = 2
        let constraintMaxHome = factory.createMaxHome(team, maxHome)
        let ct = new ConTable(6, 5)
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
        ct.setMatch(new Match(4, 0, 4))
        let result = constraintMaxHome(ct, new Match(1, 0, 1))
        expect(result).toBe(false)
    })

    // max away constraint

    it('max away constraint (3) unrelated match (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 3
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 1, 0))
        ct.setMatch(new Match(1, 2, 0))
        let result = constraintMaxAway(ct, new Match(2, 1, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max away constraint (3) (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 3
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 1, 0))
        ct.setMatch(new Match(1, 2, 0))
        let result = constraintMaxAway(ct, new Match(2, 3, 0))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max away constraint (2) last round (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 2
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 1, 0))
        ct.setMatch(new Match(1, 2, 0))
        let result = constraintMaxAway(ct, new Match(2, 3, 1))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max away constraint (2) last round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 2
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(0, 1, 0))
        ct.setMatch(new Match(1, 2, 0))
        let result = constraintMaxAway(ct, new Match(2, 3, 0))
        expect(result).toBe(false)
    })

    it('4 teams, 3 round, max away constraint (2) first round (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 2
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(1, 1, 0))
        ct.setMatch(new Match(2, 2, 0))
        let result = constraintMaxAway(ct, new Match(0, 0, 3))
        expect(result).toBe(true)
    })

    it('4 teams, 3 round, max away constraint (2) first round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 2
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(4, 3)
        ct.setMatch(new Match(1, 1, 0))
        ct.setMatch(new Match(2, 2, 0))
        let result = constraintMaxAway(ct, new Match(0, 3, 0))
        expect(result).toBe(false)
    })

    it('6 teams, 5 round, 12 matches, max away constraint (2) second round (satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 2
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(6, 5)
        ct.setMatch(new Match(0, 5, 4))
        ct.setMatch(new Match(0, 2, 1))
        ct.setMatch(new Match(0, 0, 3))
        ct.setMatch(new Match(2, 1, 4))
        ct.setMatch(new Match(2, 0, 5))
        ct.setMatch(new Match(2, 3, 2))
        ct.setMatch(new Match(3, 5, 1))
        ct.setMatch(new Match(3, 4, 3))
        ct.setMatch(new Match(3, 0, 2))
        ct.setMatch(new Match(4, 5, 2))
        ct.setMatch(new Match(4, 3, 1))
        ct.setMatch(new Match(4, 4, 0))
        let result = constraintMaxAway(ct, new Match(1, 1, 0))
        expect(result).toBe(true)
    })

    it('6 teams, 5 round, 12 matches, max away constraint (2) second round (not satisified)', () => {
        let factory = new ConstraintFactory()
        let team = 0
        let maxAway = 2
        let constraintMaxAway = factory.createMaxAway(team, maxAway)
        let ct = new ConTable(6, 5)
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
        ct.setMatch(new Match(4, 0, 4))
        let result = constraintMaxAway(ct, new Match(1, 1, 0))
        expect(result).toBe(false)
    })

})
