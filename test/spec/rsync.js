const assert = require('assert')
const path = require('path')
const readDir = require('../../src/read-dir')
const rsync = require('../../src/rsync')
const context = require('../context/WroteContext')

/* !reference readDir */
const rsyncTestSuite = {
    context,
    'should rsync a directory': (ctx) => {
        const destinationDir = path.join(ctx.TEMP_TEST_DIR)
        const fixturesDirName = path.basename(ctx.FIXTURES_TEST_DIR)
        const newDir = path.join(destinationDir, fixturesDirName)
        return rsync(ctx.FIXTURES_TEST_DIR, destinationDir)
            .then((res) => {
                assert.equal(newDir, res)
                /* @ref readDir */
                return Promise.all([
                    readDir(newDir, true),
                    readDir(ctx.FIXTURES_TEST_DIR, true),
                ])
            })
            .then((res) => {
                assert.deepEqual(res[0], res[1])
            })
    },
}

module.exports = {} // rsyncTestSuite
