const Writable = require('stream').Writable
const fs = require('fs')
const os = require('os')
const path = require('path')
const TEMP_DIR = os.tmpdir()

function openFileForWrite(filepath) {
    return Promise.resolve()
        .then(() => {
            const ws = fs.createWriteStream(filepath, {
                flags: 'w',
                defaultEncoding: 'utf8',
                fd: null,
                mode: 0o666,
                autoClose: true,
            })
            return ws
        })
}

function getTempFile() {
    const rnd = Math.ceil(Math.random() * 100000)
    const tempFile = path.join(TEMP_DIR, `wrote-${rnd}.data`)
    return tempFile
}

function erase(ws) {
    return new Promise((resolve, reject)=> {
        fs.unlink(ws.path, (err) => {
            if (err) return reject(err)
            resolve(ws)
        })
    })
    .then((ws) => {
        return new Promise((resolve, reject) => {
            ws.end((err) => {
                if (err) return reject(err)
                return resolve(ws)
            })
        })
    })
}

const wrote = function wrote(f) {
    const file = (typeof f).toLowerCase() === 'string' ?
        f : getTempFile()
    return openFileForWrite(file)
}

Object.defineProperty(wrote, 'erase', { get: () => erase })
module.exports = wrote
