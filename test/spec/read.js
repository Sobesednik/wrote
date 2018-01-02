const { throws, equal, deepEqual } = require('zoroaster/assert')
const context = require('../context/WroteContext')
const read = require('../../src/read')

const readTestSuite = {
    context,
    async 'should read a file'({
        tempFile, createTempFileWithData, TEST_DATA,
    }) {
        await createTempFileWithData()
        const res = await read(tempFile)
        equal(res, TEST_DATA)
    },
    async 'should read a file in binary'({
        tempFile, createTempFileWithData, TEST_DATA_BUFFER,
    }) {
        await createTempFileWithData()
        const res = await read(tempFile, { binary: true })
        deepEqual(res, TEST_DATA_BUFFER)
    },
    async 'should reject if file not found'() {
        const filename = `${Math.floor(Math.random() * 1e5)}.data`
        await throws({
            fn: read,
            args: [filename],
            code: 'ENOENT',
            message: new RegExp(filename),
        })
    },
    async 'should reject if path is not a string'() {
        await throws({
            fn: read,
            message: /path must be a string/,
        })
    },
}

module.exports = readTestSuite
