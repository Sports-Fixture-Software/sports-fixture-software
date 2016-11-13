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

/**
 * Match struct
 * Used for representing individual matches in fixtures. 
 */
export class Match {
    constructor( 
        public roundNum: number,
        public homeTeam: number,
        public awayTeam: number, 
        public reserved: boolean = false ){}

    isEqual(match: Match): boolean {
        if( this.roundNum == match.roundNum && 
            this.homeTeam == match.homeTeam &&
            this.awayTeam == match.awayTeam ){
            return true;
        }
        return false;
    }

    /**
     * isContainedIn
     * Used for checking uniqueness in a round of a fixture made up of a 2D 
     * array of matches.
     * 
     * Returns:
     * True if this match isEqual with a match in matches.
     * False if not.
     */
    isContainedIn(matches: Match[]): boolean {
        for( let i: number = 0; i < matches.length; i++ ){
            if( this.isEqual(matches[i]) ){
                return true;
            }
        }

        return false;
    }
}
