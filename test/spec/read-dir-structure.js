const assert = require('assert')
const readDirStructure = require('../../src/read-dir-structure')
const context = require('../context/WroteContext')

const readDirStructureTestSuite = {
    context,
    'should read directory structure': (ctx) => {
        return readDirStructure(ctx.FIXTURES_TEST_DIR)
            .then((res) => {
                assert.deepEqual(res, ctx.expectedFixturesStructure)
            })
    },
    'should not work when directory is not passed': () => {
        return readDirStructure()
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.message, 'Please specify a path to the directory')
            })
    },
    'should not work when directory does not exist': () => {
        return readDirStructure('fake-directory')
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.code, 'ENOENT')
            })
    },
    'should not work when passing a path to file': (ctx) => {
        return ctx.createTempFileWithData()
            .then(() => {
                return readDirStructure(ctx.tempFile)
            })
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.code, 'ENOTDIR')
            })
    },
    'should not work when passing a path to soft link': (ctx) => {
        return readDirStructure(ctx.FIXTURES_TEST_DIR_SOFT_LINK)
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.message, 'Path is not a directory')
                assert.equal(err.code, 'ENOTDIR')
            })
    },
}

module.exports = readDirStructureTestSuite
