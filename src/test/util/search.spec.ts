import { Search } from '../../app/util/search'

/**
 * Unit tests for the util Search
 */
describe('util search', () => {
    it('empty array', () => {
        let arr: number[] = []
        let result = Search.binarySearch(arr, 1, (a: number, b: number) => { return a - b })
        expect(result).toBe(~0)
    })

    it('array of 1, gt', () => {
        let arr: number[] = [5]
        let result = Search.binarySearch(arr, 6, (a: number, b: number) => { return a - b })
        expect(result).toBe(~1)
    })

    it('array of 1, lt', () => {
        let arr: number[] = [5]
        let result = Search.binarySearch(arr, 3, (a: number, b: number) => { return a - b })
        expect(result).toBe(~0)
    })

    it('array of 1, eq', () => {
        let arr: number[] = [5]
        let result = Search.binarySearch(arr, 5, (a: number, b: number) => { return a - b })
        expect(result).toBe(0)
    })

    it('array of 2, eq', () => {
        let arr: number[] = [5, 7]
        let result = Search.binarySearch(arr, 7, (a: number, b: number) => { return a - b })
        expect(result).toBe(1)
        result = Search.binarySearch(arr, 5, (a: number, b: number) => { return a - b })
        expect(result).toBe(0)
    })

    it('array of 3, eq', () => {
        let arr: number[] = [5, 7, 9]
        let result = Search.binarySearch(arr, 7, (a: number, b: number) => { return a - b })
        expect(result).toBe(1)
        result = Search.binarySearch(arr, 5, (a: number, b: number) => { return a - b })
        expect(result).toBe(0)
        result = Search.binarySearch(arr, 9, (a: number, b: number) => { return a - b })
        expect(result).toBe(2)
    })

    it('array of 3, insert 0', () => {
        let arr: number[] = [5, 7, 9]
        let result = Search.binarySearch(arr, 3, (a: number, b: number) => { return a - b })
        expect(result).toBe(~0)
    })

    it('array of 3, insert 1', () => {
        let arr: number[] = [5, 7, 9]
        let result = Search.binarySearch(arr, 6, (a: number, b: number) => { return a - b })
        expect(result).toBe(~1)
    })

    it('array of 3, insert 2', () => {
        let arr: number[] = [5, 7, 9]
        let result = Search.binarySearch(arr, 8, (a: number, b: number) => { return a - b })
        expect(result).toBe(~2)
    })

    it('array of 3, insert 3', () => {
        let arr: number[] = [5, 7, 9]
        let result = Search.binarySearch(arr, 10, (a: number, b: number) => { return a - b })
        expect(result).toBe(~3)
    })

})
