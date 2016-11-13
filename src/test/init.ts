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

///<reference path="../../typings/index.d.ts" />

import "reflect-metadata"
import * as fs from 'fs'
let Application = require('spectron').Application
let electron = require('electron')

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
