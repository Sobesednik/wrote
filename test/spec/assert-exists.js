const assert = require('assert')
const { join } = require('path')
const assertExists = require('../../src/assert-exists')
const context = require('../context/WroteContext')

const { equal } = assert

const eraseTestSuite = {
    context,
    async 'should throw an error for a file'({ tempFile }) {
        try {
            await assertExists(tempFile)
            throw new Error('should have thrown')
        } catch ({ message }) {
            equal(message, `Path ${tempFile} does not exist.`)
        }
    },
    async 'should pass for a file'({ tempFile, createTempFileWithData }) {
        await createTempFileWithData()
        await assertExists(tempFile)
    },
    async 'should pass for a directory'({ FIXTURES_TEST_DIR }) {
        await assertExists(FIXTURES_TEST_DIR)
    },
    async 'should throw a permission denied error'({ makeNoExecutableDirectory }) {
        const temp = await makeNoExecutableDirectory()
        const test = join(temp, 'test/wrote.data')
        try {
            await assertExists(test)
            throw new Error('should have thrown')
        } catch ({ code }) {
            equal(code, 'EACCES')
        }
    },
}

module.exports = eraseTestSuite
