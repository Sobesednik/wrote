const Readable = require('stream').Readable
const Writable = require('stream').Writable
const makePromise = require('makepromise')

/**
 * Write data to the stream, and resolve when it's ended.
 * @param {Writable} ws write stream
 * @param {string|Readable} source read source
 * @returns {Promise<Writable>} A promise resolved with the writable stream, or rejected
 * when an error occurred while reading or writing.
 */
async function write(ws, source) {
    if (!(ws instanceof Writable)) {
        throw new Error('Writable stream expected')
    }
    if (source instanceof Readable) {
        if (!source.readable) {
            throw new Error('Stream is not readable')
        }
        await new Promise((resolve, reject) => {
            ws.on('finish', resolve)
            ws.on('error', reject)
            source.on('error', reject)
            source.pipe(ws)
        })
        return ws
    }
    await makePromise(ws.end.bind(ws), source)
    return ws
}

module.exports = write
