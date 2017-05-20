const assert = require('assert')
const wrote = require('../src/index')
const Writable = require('stream').Writable
const os = require('os')
const path = require('path')

const tempFile = path.join(os.tmpdir(), 'random-file-name')

const wroteTestSuite = {
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
    }
}


module.exports = wroteTestSuite
