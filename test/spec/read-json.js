const { deepEqual, throws } = require('zoroaster/assert')
const context = require('../context/WroteContext')
const readJSON = require('../../src/read-json')

const readJSONTestSuite = {
    context,
    async 'should read a JSON file'({ expectedJSON, JSONpath }) {
        const res = await readJSON(JSONpath)
        deepEqual(res, expectedJSON)
    },
    async 'should throw an error if file is not found'({ tempFile }) {
        await throws({
            fn: readJSON,
            args: [tempFile],
            code: 'ENOENT',
        })
    },
    async 'should throw an error if cannot parse JSON'({ invalidJSONpath }) {
        await throws({
            fn: readJSON,
            args: [invalidJSONpath],
            message: /Unexpected token h/,
        })
    },
}

module.exports = readJSONTestSuite
