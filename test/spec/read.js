const assert = require('assert')
const context = require('../context/WroteContext')
const read = require('../../src/read')

const readTestSuite = {
    context,
    async 'should read a file'(ctx) {
        await ctx.createTempFileWithData()
        const res = await read(ctx.tempFile)
        assert.equal(res, ctx.TEST_DATA)
    },
    async 'should reject if file not found'() {
        const filename = `${Math.floor(Math.random() * 1e5)}.data`
        try {
            await read(filename)
            throw new Error('should have been rejected with ENOENT')
        } catch ({ code, message }) {
            assert(code, 'ENOENT')
            assert(message.indexOf(filename) !== -1)
        }
    },
    async 'should reject if path is not a string'() {
        try {
            await read()
            throw new Error('should have been rejected')
        } catch ({ message }) {
            assert(message.indexOf('path must be a string') !== -1)
        }
    },
}

module.exports = readTestSuite
