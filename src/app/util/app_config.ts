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

let _process: NodeJS.Process
try {
    _process = require('electron').remote.process
}
catch (error) {
    // unit testing does not run in electron 
    _process = process
}
    
export class AppConfig {

    /**
     * Check if in developer mode. Developer mode if '--debug'
     * exists anywhere on the command-line.
     */
    static isDeveloperMode(): boolean {
        if (this.developerMode == undefined) {
            if (_process.argv && _process.argv.indexOf('--debug') >= 0) {
                this.developerMode = true
            } else {
                this.developerMode = false
            }
        }
        return this.developerMode
    }

    /**
     * Returns the database filename. The default database filename is returned
     * unless an alternate database filename is specified on the command-line
     * using:
     *  --database=filename
     *
     * The alternate database filename is used for testing.
     */
    static getDatabaseFilename(): string {
        if (this.databaseFilename == undefined) {
            if (_process.argv) {
                let argv = _process.argv
                for (let i = 1; i < argv.length; i++) {
                    if (argv[i].startsWith('--database=')) {
                        let filename = argv[i].slice('--database='.length)
                        if (filename != '') {
                            this.databaseFilename = filename
                        }
                        break
                    }
                }
            }
            if (this.databaseFilename == undefined) {
                this.databaseFilename = this.DATABASE_FILENAME_DEFAULT
            }
        }
        return this.databaseFilename
    }

    static log(err: Error | string) {
        if (this.isDeveloperMode()) {
            console.log(err)
        }
    }

    static DatabaseErrorGuidance: string = `There may be a problem with the
        database file. Try restoring the database file from a backup, if
        available.`
    static FileErrorGuidance: string = `Check file permissions or try a different file.`

    private static DATABASE_FILENAME_DEFAULT = 'sanfl_fixture_software.database'
    private static databaseFilename: string
    private static developerMode: boolean
}
