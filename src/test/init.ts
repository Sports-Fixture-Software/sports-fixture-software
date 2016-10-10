import "reflect-metadata"
import * as fs from 'fs'
let Application = require('spectron').Application
let electron = require('electron-prebuilt')

// set to 1 for fast computer, 2 for computer that half as fast, etc
export const computerSpeed = 1

export class TestApp {

    static startApp(done: () => void): any {
        try {
            fs.unlinkSync('test-end-to-end.database')
        } catch (error) { }
        let app = new Application({
            path: electron,
            args: ['build', '--database=test-end-to-end.database']
        })
        app.start().then(() => {
            done()
        })
        return app
    }

    static stopApp(app: any, done: () => void) {
        if (app && app.isRunning()) {
            app.stop().then(() => {
                done()
            })
        } else {
            done()
        }

    }
}
