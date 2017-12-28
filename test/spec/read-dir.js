const { deepEqual } = require('assert-diff')
const assert = require('assert')
const readDir = require('../../src/read-dir')
const context = require('../context/WroteContext')
const expected = require('../fixtures/expected/read-dir')

const readDirTestSuite = {
    context,
    async 'should read a directory'({ FIXTURES_TEST_DIR }) {
        const res = await readDir(FIXTURES_TEST_DIR)
        deepEqual(res, expected.normal)
    },
    async 'should read a directory recursively'({ FIXTURES_TEST_DIR }) {
        const res = await readDir(FIXTURES_TEST_DIR, true)
        deepEqual(res, expected.recursive)
    },
    async 'should reject promise if directory is not found'() {
        const dirname = `${Math.floor(Math.random() * 1e5)}.data`
        try {
            await readDir(dirname)
            throw new Error('should have thrown an error')
        } catch ({ code }) {
            assert.equal(code, 'ENOENT')
        }
    },
    async 'should reject promise if not a directory'(ctx) {
        try {
            await ctx.createTempFileWithData()
            await readDir(ctx.tempFile)
            throw new Error('should have thrown an error')
        } catch ({ code }) {
            assert.equal(code, 'ENOTDIR')
        }
    },
    async 'should throw if path is not a string'() {
        try {
            await readDir()
            throw new Error('should have thrown an error')
        } catch ({ message }) {
            assert(/path must be a string/.test(message))
        }
    },
}

module.exports = readDirTestSuite
