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
