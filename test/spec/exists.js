const assert = require('assert')
const { join } = require('path')
const exists = require('../../src/exists')
const context = require('../context/WroteContext')

const { equal } = assert

const eraseTestSuite = {
    context,
    async 'should return false for a file'({ tempFile }) {
        const res = await exists(tempFile)
        assert(!res)
    },
    async 'should return true for a file'({ tempFile, createTempFileWithData }) {
        await createTempFileWithData()
        const res = await exists(tempFile)
        assert(res)
    },
    async 'should return true for a directory'({ FIXTURES_TEST_DIR }) {
        const res = await exists(FIXTURES_TEST_DIR)
        assert(res)
    },
    async 'should throw a permission denied error'({ makeNoExecutableDirectory }) {
        const temp = await makeNoExecutableDirectory()
        const test = join(temp, 'test/wrote.data')
        try {
            await exists(test)
            throw new Error('should have thrown')
        } catch ({ code }) {
            equal(code, 'EACCES')
        }
    },
}

module.exports = eraseTestSuite
