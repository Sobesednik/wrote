const assert = require('assert')
const { Writable } = require('stream')
const createWritable = require('../../src/create-writable')
const WroteContext = require('../context/WroteContext')

const createWritableTestSuite = {
    context: WroteContext,
    'should be a function'() {
        assert(typeof createWritable === 'function')
    },
    async 'should return a promise'() {
        const res = createWritable()
        assert(res instanceof Promise)
        await res
    },
    async 'should resolve with a write stream'() {
        const ws = await createWritable()
        assert(ws instanceof Writable)
    },
    async 'should open specified file'({ tempFile }) {
        const ws = await createWritable(tempFile)
        assert.equal(ws.path, tempFile)
        assert(ws instanceof Writable)
        assert(ws.writable)
    },
    async 'should be able to close the stream'({ tempFile }) {
        const ws = await createWritable(tempFile)
        await new Promise((resolve, reject) => {
            ws.once('close', () => resolve(ws))
            ws.once('error', reject)
            ws.close()
        })
    },
}

module.exports = createWritableTestSuite
