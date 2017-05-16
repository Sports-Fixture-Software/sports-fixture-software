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

import { Round } from '../models/round'
import * as fs from 'fs'
import { EOL } from 'os'

export class ExportTo {

    /**
     * Convert the generated fixture (represented by `rounds`) to comma
     * separated values (CSV) and writes to `stream`. The `rounds` must be eager
     * loaded, otherwise the match-up information will be missing from the file.
     */
    static fixtureCSV(stream: fs.WriteStream, rounds: Round[]) {
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
     * Convert the generated fixture (represented by `rounds`) to a comma
     * separated values (CSV) format such that matches are grouped by teams.
     * The output is written to `stream`.  The `rounds` must be eager loaded.
     */
    static teamCSV(stream: fs.WriteStream, rounds: Round[]) {
        var teamMap : {[key: string]: string[]} = {}
        var roundInfo: string[] = []
        for (let round of rounds) {
            roundInfo.push(round.number + ',' + this.CSVify(round.startDate.format('YYYY-MM-DD')))

            for (let match of round.matchesPreLoaded) {
                if (match.homeTeamPreLoaded && match.awayTeamPreLoaded) {
                    if (!(match.homeTeamName in teamMap)) {
                        teamMap[match.homeTeamName] = []
                    }
                    if (!(match.awayTeamName in teamMap)) {
                        teamMap[match.awayTeamName] = []
                    }

                    teamMap[match.homeTeamName].push('Home,' + this.CSVify(match.awayTeamName))
                    teamMap[match.awayTeamName].push('Away,' + this.CSVify(match.homeTeamName))
                }
            }
        }

        for (var team in teamMap) {
            stream.write(this.CSVify(team) + EOL)
            let matches = teamMap[team]
            matches.forEach((current, idx, arr)=>{
                stream.write(roundInfo[idx] + ','  + current + EOL)
            })
            stream.write(',' + EOL)
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
