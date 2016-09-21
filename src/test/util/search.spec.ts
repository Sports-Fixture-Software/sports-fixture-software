import { Search } from '../../app/util/search'
describe('util search', () => {
    it('empty array', () => {
        let result = Search.binarySearch([], 1, (a:number, b:number) => { a - b})
        expect(result).toBe(-1)
    })
})
