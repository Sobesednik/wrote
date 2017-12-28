const assert = require('assert')
const { deepEqual } = require('assert-diff')
const readDirStructure = require('../../src/read-dir-structure')
const context = require('../context/WroteContext')

const readDirStructureTestSuite = {
    context,
    async 'should read directory structure'({ FIXTURES_TEST_DIR, expectedFixturesStructure }) {
        const res = await readDirStructure(FIXTURES_TEST_DIR)
        deepEqual(res, expectedFixturesStructure)
    },
    async 'should not work when directory is not passed'() {
        try {
            await readDirStructure()
            throw new Error('should have been rejected')
        } catch ({ message }) {
            assert.equal(message, 'Please specify a path to the directory')
        }
    },
    async 'should not work when directory does not exist'() {
        try {
            await readDirStructure('fake-directory')
            throw new Error('should have been rejected')
        } catch ({ code }) {
            assert.equal(code, 'ENOENT')
        }
    },
    async 'should not work when passing a path to file'(ctx) {
        try {
            await ctx.createTempFileWithData()
            await readDirStructure(ctx.tempFile)
            throw new Error('should have been rejected')
        } catch ({ code }) {
            assert.equal(code, 'ENOTDIR')
        }
    },
    async 'should not work when passing a path to soft link'(ctx) {
        try {
            await readDirStructure(ctx.FIXTURES_TEST_DIR_SOFT_LINK)
            throw new Error('should have been rejected')
        } catch ({ message, code }) {
            assert.equal(message, 'Path is not a directory')
            assert.equal(code, 'ENOTDIR')
        }
    },
}

module.exports = readDirStructureTestSuite
