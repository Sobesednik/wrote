const assert = require('assert')
const { join } = require('path')
const assertDoesNotExist = require('../../src/assert-does-not-exist')
const context = require('../context/WroteContext')

const { equal } = assert

const eraseTestSuite = {
    context,
    async 'should pass for a file'({ tempFile }) {
        await assertDoesNotExist(tempFile)
    },
    async 'should throw for a file'({ tempFile, createTempFileWithData }) {
        await createTempFileWithData()
        try {
            await assertDoesNotExist(tempFile)
        } catch ({ message }) {
            equal(message, `Path ${tempFile} exists.`)
        }
    },
    async 'should throw for a directory'({ FIXTURES_TEST_DIR }) {
        try {
            await assertDoesNotExist(FIXTURES_TEST_DIR)
        } catch ({ message }) {
            equal(message, `Path ${FIXTURES_TEST_DIR} exists.`)
        }
    },
    async 'should throw a permission denied error'({ makeNoExecutableDirectory }) {
        const temp = await makeNoExecutableDirectory()
        const test = join(temp, 'test/wrote.data')
        try {
            await assertDoesNotExist(test)
            throw new Error('should have thrown')
        } catch ({ code }) {
            equal(code, 'EACCES')
        }
    },
}

module.exports = eraseTestSuite
