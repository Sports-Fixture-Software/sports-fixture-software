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

export class Search {
    /**
     * binary search `theArray`, looking for `element`.
     *
     * `theArray` must be sorted. `compare` is a binary compare function that
     * returns < 0 if arg1 < arg2, returns 0 if arg1 == arg2, and returns > 0
     * if arg1 > arg2.
     *
     * Returns the index if found. Returns < 0 if not found. If not found,
     * returns the bitwise compliment of the index to insert the `element` if
     * maintaining a sorted array.
     */
    static binarySearch(theArray: any[], element: any, compare: Function): number {
        let m = 0;
        let n = theArray.length - 1;
        while (m <= n) {
            let k = (n + m) >> 1;
            let cmp = compare(element, theArray[k]);
            if (cmp > 0) {
                m = k + 1;
            } else if (cmp < 0) {
                n = k - 1;
            } else {
                return k;
            }
        }
        return ~m
    }
}
