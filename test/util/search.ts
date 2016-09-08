import { Search } from '../../src/app/util/search'

describe('binary search', () => {
    it('empty array', () => {
        let index = Search.binarySearch([], 5, (a: number, b: number) => {
            return a - b
        })
        expect(index).toBe(-1)
    })
})
