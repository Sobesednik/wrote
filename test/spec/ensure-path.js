const assert = require('assert')
const path = require('path')
const ensurePath = require('../../src/ensure-path')
const context = require('../context/WroteContext')

const ensurePathTestSuite = {
    context,
    async 'should create a path to the file'(ctx) {
        const tempPath = path.join(ctx.TEMP_TEST_DIR, 'path/to/temp/file.data')
        const res = await ensurePath(tempPath)
        assert.equal(res, tempPath)
        await ctx.assertCanWriteFile(tempPath)
    },
    async 'should reject when trying to create a path where cannot'(ctx) {
        await ctx.makeNoExecutableDirectory()
        const tempPath = path.join(ctx.TEMP_NOX_DIR, 'path/to/temp/file.data')
        try {
            await ensurePath(tempPath)
            throw new Error('should have thrown an error')
        } catch (err) {
            if(!/EACCES/.test(err.message)) {
                throw err
            }
        }
    },
    async 'should not throw an error when dir already exists'(ctx) {
        const tempPath = path.join(ctx.TEMP_TEST_DIR, 'file.data')
        const res = await ensurePath(tempPath)
        assert.equal(res, tempPath)
        await ctx.assertCanWriteFile(tempPath)
    },
}

module.exports = ensurePathTestSuite
