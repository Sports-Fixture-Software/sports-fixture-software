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

import { TestApp, computerSpeed } from '../init'
import * as webdriverio from 'webdriverio'
import * as Promise from 'bluebird'

/**
 * end-to-end test suite for application initialisation
 */
describe('application initialise', function () {
    let app: any
    
    beforeEach((done) => {
        app = TestApp.startApp(done)
    }, 7000 * computerSpeed)

    afterEach((done) => {
        TestApp.stopApp(app, done)
    }, 7000 * computerSpeed)

    /**
     * Test a browser window is displayed and angular loads.
     */
    it('browser window displayed with angular loaded', (done) => {
        let client = app.client as webdriverio.Client<void>
        client.waitForExist('router-outlet').then((found) => {
            expect(found).toBe(true)
            return app.browserWindow.isVisible()
        }).then((visible) => {
            expect(visible).toBe(true)
            done()
        })
    }, 6000 * computerSpeed)
})
