const { createWriteStream } = require('fs')
const { resolve } = require('path')
const { tmpdir } = require('os')

async function openFileForWrite(path) {
    const writable = await new Promise((resolve, reject) => {
        const ws = createWriteStream(path, {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true,
        })
        ws.once('open', () => resolve(ws))
        ws.once('error', reject)
    })
    return writable
}

function getTempFile() {
    const rnd = Math.ceil(Math.random() * 100000)
    const tempFile = resolve(tmpdir(), `wrote-${rnd}.data`)
    return tempFile
}

/**
 * Open the file for writing and create a write stream.
 * @param {string} ffile path to the file
 * @returns {Promise<Writable>} A promise with the stream
 */
async function createWritable(file = getTempFile()) {
    const ws = await openFileForWrite(file)
    return ws
}

module.exports = createWritable
