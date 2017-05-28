const fs = require('fs')
const os = require('os')
const path = require('path')
const Readable = require('stream').Readable
const Writable = require('stream').Writable
const makePromise = require('makepromise')
const TEMP_DIR = os.tmpdir()
const ensurePath = require('./ensure-path')

function openFileForWrite(filepath) {
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(filepath, {
            flags: 'w',
            defaultEncoding: 'utf8',
            fd: null,
            mode: 0o666,
            autoClose: true,
        })
        ws.once('open', () => resolve(ws))
        ws.once('error', reject)
    })
}

function getTempFile() {
    const rnd = Math.ceil(Math.random() * 100000)
    const tempFile = path.join(TEMP_DIR, `wrote-${rnd}.data`)
    return tempFile
}

function unlink(path) {
    const promise = makePromise(fs.unlink, path, path)
    return promise
}

function endStream(ws) {
    if (!ws.writable || ws.closed) {
        return Promise.reject(new Error('stream should be writable'))
    }
    const promise = new Promise((resolve, reject) => {
        ws.once('close', () => resolve(ws))
        ws.once('error', reject)
    })
    return makePromise(ws.close.bind(ws))
        .then(() => promise)
}

function erase(ws) {
    return unlink(ws.path)
        .then(() => {
            if (!ws.closed) {
                return endStream(ws)
            }
            return ws
        })
}

/**
 * Open the file for writing and create a write stream.
 * @param {string} ffile path to the file
 * @returns {Promise<Writable>} A promise with the stream
 */
function wrote(file) {
    const _file = (typeof file).toLowerCase() === 'string' ?
        file : getTempFile()
    return openFileForWrite(_file)
}

/**
 * Write data to the stream, and resolve when it's ended.
 * @param {Writable} ws write stream
 * @param {string|Readable} source read source
 * @returns {Promise<Writable>} A promise resolved with the writable stream, or rejected
 * when an error occurred while reading or writing.
 */
function write(ws, source) {
    if (!(ws instanceof Writable)) {
        return Promise.reject(new Error('Writable stream expected'))
    }
    if (source instanceof Readable) {
        if (!source.readable) {
            return Promise.reject(new Error('Stream is not readable'))
        }
        return new Promise((resolve, reject) => {
            ws.on('finish', () => {
                resolve(ws)
            })
            ws.on('error', reject)
            source.on('error', reject)
            source.pipe(ws)
        })
    }
    return makePromise(ws.end.bind(ws), source, ws)
}

Object.defineProperty(wrote, 'ensurePath', { get: () => ensurePath })
Object.defineProperty(wrote, 'write', { get: () => write })
Object.defineProperty(wrote, 'erase', { get: () => erase })

module.exports = wrote
