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
