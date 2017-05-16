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

import * as fs from 'fs'
import * as Promise from 'bluebird'

export class FileFolder {

    /**
     * Creates a buffered write stream at the location specified by `filename`.
     * If the creation was unsuccessful, an error is thrown.
     */
    static createWriteStream(filename: string): Promise<fs.WriteStream> {
        return new Promise<fs.WriteStream>((resolve, reject) => {
            if (filename && filename.length > 0) {
                let stream = fs.createWriteStream(filename)
                stream.on('open', () => {
                    // Cork the stream (buffer the stream). cork is supported
                    // by node.js, but not the typings sadly:
                    (stream as any).cork()
                    return resolve(stream)
                })
                stream.on('error', (err: Error) => {
                    return reject(err)
                })
            } else {
                return reject(new Error(`Unable to save to the location '${filename}'`))
            }
        })
    }
}
