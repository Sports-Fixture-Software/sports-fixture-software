import { Round } from '../models/round'
import * as fs from 'fs'
import { EOL } from 'os'

export class ExportTo {

    /**
     * Convert the generated fixture (represented by `rounds`) to comma
     * separated values (CSV) and writes to `stream`. The `rounds` must be eager
     * loaded, otherwise the match-up information will be missing from the file.
     */
    static CSV(stream: fs.WriteStream, rounds: Round[]) {
        for (let round of rounds) {
            stream.write('Round ' + round.number + ',' + this.CSVify(round.startDate.format('YYYY-MM-DD')) + EOL)
            for (let match of round.matchesPreLoaded) {
                if (match.homeTeamPreLoaded && match.awayTeamPreLoaded) {
                    stream.write(',,' + this.CSVify(match.homeTeamName) + ',' + this.CSVify(match.awayTeamName) + EOL)
                }
            }
        }
    }

    /**
     * Convert a string into a CSV string. If the string contains " or , or \n
     * the string is wrapped in " ". If the string contains ", the " is
     * replaced with "".
     *
     * Returns the CSV converted string.
     */
    private static CSVify(str: string): string {
        var res = str.replace(/"/g, '""')
        if (res.search(/("|,|\n)/g) >= 0) {
            res = `"${res}"`
        }
        return res
    }
}
