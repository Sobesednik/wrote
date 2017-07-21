const assert = require('assert')
const readDirStructure = require('../../src/read-dir-structure')
const expected = require('../fixtures/expected/read-dir-structure')
const context = require('../context/WroteContext')

const readDirStructureTestSuite = {
    context,
    'should read directory structure': (ctx) => {
        return readDirStructure(ctx.FIXTURES_TEST_DIR)
            .then((res) => {
                console.log(JSON.stringify(res, null, 2))
                assert.deepEqual(res, expected)
            })
    },
    'should not work when directory is not passed': () => {
        return readDirStructure()
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.message, 'Please give path to directory')
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
}

module.exports = readDirStructureTestSuite
