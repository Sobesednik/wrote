const assert = require('assert')
const { Writable } = require('stream')
const wrote = require('../../src/wrote')
const WroteContext = require('../context/WroteContext')

const wroteTestSuite = {
    context: WroteContext,
    'should be a function': () => {
        assert(typeof wrote === 'function')
    },
    async 'should return a promise'() {
        const res = wrote()
        assert(res instanceof Promise)
        await res
    },
    async 'should resolve with a write stream'() {
        const ws = await wrote()
        assert(ws instanceof Writable)
    },
    async 'should open specified file'({ tempFile }) {
        const ws = await wrote(tempFile)
        assert.equal(ws.path, tempFile)
        assert(ws instanceof Writable)
        assert(ws.writable)
    },
    async 'should be able to close the stream'({ tempFile }) {
        const ws = await wrote(tempFile)
        await new Promise((resolve, reject) => {
            ws.once('close', () => resolve(ws))
            ws.once('error', reject)
            ws.close()
        })
    },
}

module.exports = {
    wroteTestSuite,
}
