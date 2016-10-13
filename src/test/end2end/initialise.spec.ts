let Application = require('spectron').Application
let electron = require('electron-prebuilt')
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'
import * as fs from 'fs'

describe('application initialise', function () {
    let app: any
    
    beforeEach((done) => {
        try {
            fs.unlinkSync('test-end-to-end.database')
        } catch (error) { }
        app = new Application({
            path: electron,
            args: ['build', '--database=test-end-to-end.database']
        })
        app.start().then(() => {
            done()
        })
    }, 10000)

    afterEach((done) => {
        if (app && app.isRunning()) {
            app.stop().then(() => {
                done()
            })
        }
    }, 10000)

    it('browser window displayed with angular loaded', (done) => {
        let client = app.client as webdriverio.Browser<void>
        client.waitForExist('router-outlet').then((found) => {
            expect(found).toBe(true)
            return app.browserWindow.isVisible()
        }).then((visible) => {
            expect(visible).toBe(true)
            done()
        })
    }, 10000)
})
