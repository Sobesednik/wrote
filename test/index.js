const assert = require('assert')
const wrote = require('../src/index')
const Writable = require('stream').Writable
const os = require('os')
const path = require('path')
const fs = require('fs')

const tempFile = path.join(os.tmpdir(), 'random-file-name')

const createTempFilePath = () => {
    return path.join(os.tmpdir(), `wrote-${Math.floor(Math.random() * 1e3)}.data`)
}

const wroteTestSuite = {
    context: {
        createTempFilePath,
    },
    'should be a function': () => {
        assert(typeof wrote === 'function')
    },
    'should return a promise': () => {
        const res = wrote()
        assert(res instanceof Promise)
        return res.catch(() => {})
    },
    'should resolve with a write stream': () => {
        const res = wrote()
            .then((ws) => {
                assert(ws instanceof Writable)
            })
        return res
    },
    'should open specified file': () => {
        return wrote(tempFile)
            .then((ws) => {
                assert(ws instanceof Writable)
                assert.equal(ws.path, tempFile)
            })
    },
    'should stop': () => {
        return wrote(tempFile)
            .then((ws) => {
                const promise = new Promise((resolve, reject) => {
                    ws.once('close', () => resolve(ws))
                    ws.once('error', reject)
                    ws.close()
                })
                return promise
            })
    },
    'should erase': (ctx) => {
        const filepath = ctx.createTempFilePath()
        return wrote(filepath)
            .then((ws) => {
                return wrote.erase(ws)
            })
            .then((ws) => {
                assert(!ws.writable)
                assert.equal(ws.path, filepath)
                return new Promise((resolve, reject) => {
                    fs.stat(ws.path, (err, stats) => {
                        if (err) return reject(err)
                        return resolve(stats)
                    })
                })
            })
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert(/^ENOENT: no such file or directory/.test(err.message))
            })
    }
}


module.exports = wroteTestSuite
