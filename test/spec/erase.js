const assert = require('assert')
const makePromise = require('makepromise')
const erase = require('../../src/erase')
const createWritable = require('../../src/create-writable')
const context = require('../context/WroteContext')

const eraseTestSuite = {
    context,
    async 'should close and erase open stream'({ tempFile, assertFileDoesNotExist }) {
        const ws = await createWritable(tempFile)
        assert(!ws.closed)
        await erase(ws)
        assert(ws.closed) // if node 6+, assert writable == false
        assert.equal(ws.path, tempFile)
        await assertFileDoesNotExist(tempFile)
    },
    async 'should close and erase temp open stream'({ assertFileDoesNotExist }) {
        const ws = await createWritable()
        assert(!ws.closed)
        await erase(ws)
        assert(ws.closed)
        await assertFileDoesNotExist(ws.path)
    },
    async 'should erase closed stream'({
        tempFile, assertFileExists, assertFileDoesNotExist,
    }) {
        const ws = await createWritable(tempFile)
        await makePromise(ws.end.bind(ws))
        assert(ws.closed)
        await assertFileExists(tempFile)
        await erase(ws)
        await assertFileDoesNotExist(tempFile)
    },
}

module.exports = eraseTestSuite
