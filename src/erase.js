const makePromise = require('makepromise')
const fs = require('fs')

async function unlink(path) {
    await makePromise(fs.unlink, path)
}

async function endStream(ws) {
    if (!ws.writable || ws.closed) {
        throw new Error('stream should be writable')
    }
    const promise = new Promise((resolve, reject) => {
        ws.once('close', resolve)
        ws.once('error', reject)
    })
    await makePromise(ws.close.bind(ws))
    await promise
}

/**
 * Unlink a file based on its WriteStream and close the underlying stream.
 * @param {Writable} ws Writable of a file
 * @returns {Promise.<Writable>} Closed writable stream
 */
async function erase(ws) {
    await unlink(ws.path)
    if (ws.writable) {
        await endStream(ws)
    }
    return ws
}

module.exports = erase
