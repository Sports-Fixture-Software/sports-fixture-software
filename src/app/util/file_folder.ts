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
