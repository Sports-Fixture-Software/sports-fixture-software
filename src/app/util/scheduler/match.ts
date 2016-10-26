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
