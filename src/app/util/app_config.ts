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

    private static DATABASE_FILENAME_DEFAULT = 'sanfl_fixture_software.database'
    private static databaseFilename: string
    private static developerMode: boolean
}
