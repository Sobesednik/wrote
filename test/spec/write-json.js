const { deepEqual, equal } = require('zoroaster/assert')
const { resolve } = require('path')
const context = require('../context/WroteContext')
const writeJSON = require('../../src/write-json')

const expectedJSONWithSpaces = `{
  "json": true,
  "test": "data",
  "date": null
}`

const readJSONTestSuite = {
    context,
    async 'should write JSON to a file'({ expectedJSON, TEMP_TEST_DIR }) {
        const file = resolve(TEMP_TEST_DIR, 'test.json')
        await writeJSON(file, expectedJSON)
        const actual = require(file)
        deepEqual(actual, expectedJSON)
    },
    async 'should not use spaces'({ expectedJSON, TEMP_TEST_DIR, read }) {
        const file = resolve(TEMP_TEST_DIR, 'test.json')
        await writeJSON(file, expectedJSON)
        const res = await read(file)
        equal(res, '{"json":true,"test":"data","date":null}')
    },
    async 'should use spaces'({ expectedJSON, TEMP_TEST_DIR, read }) {
        const file = resolve(TEMP_TEST_DIR, 'test.json')
        await writeJSON(file, expectedJSON, { space: 2 })
        const res = await read(file)
        equal(res, expectedJSONWithSpaces)
    },
    async 'should use a replacer function'({ expectedJSON, TEMP_TEST_DIR, read }) {
        const file = resolve(TEMP_TEST_DIR, 'test.json')
        const test = 5
        await writeJSON(file, expectedJSON, { replacer() {
            return test
        } })
        const res = await read(file)
        equal(res, test)
    },

}

module.exports = readJSONTestSuite
