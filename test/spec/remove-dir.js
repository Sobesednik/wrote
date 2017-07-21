const assert = require('assert')
const path = require('path')
const lib = require('../../src/lib/')
const readDir = require('../../src/read-dir')
const remove = require('../../src/remove-dir')
const rsync = require('../../src/rsync')
const context = require('../context/WroteContext')

/* !reference rsync, readDir */
const removeDirTestSuite = {
    context,
    'should remove a directory': (ctx) => {
        const destinationDir = path.join(ctx.TEMP_TEST_DIR)
        const fixturesDirName = path.basename(ctx.FIXTURES_TEST_DIR)
        const newDir = path.join(destinationDir, fixturesDirName)
        /* @ref rsync */
        return rsync(ctx.FIXTURES_TEST_DIR, destinationDir)
            .then((res) => {
                assert.equal(newDir, res)
                assert.notEqual(newDir.indexOf(ctx.TEMP_TEST_DIR), -1) // make sure we use temp of some kind
                assert(/temp/.test(newDir))
                return remove(newDir)
            })
            .then((res) => {
                const flat = lib.flattenAll(ctx.fixturesStructure)
                    .map((item) => {
                        return path.join(newDir, item)
                    })
                    .concat(newDir)
                assert.deepEqual(flat.sort(), res.sort())

                /* @ref readDir */
                return readDir(newDir, true)
            })
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.code, 'ENOENT')
            })
    },
    'should not work when directory is not passed': () => {
        return remove()
            .then(() => {
                throw new Error('should have been rejected')
            }, (err) => {
                assert.equal(err.message, 'Please give path to directory')
            })
    },
}

module.exports = removeDirTestSuite
