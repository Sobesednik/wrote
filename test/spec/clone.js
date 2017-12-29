const assert = require('assert')
const { deepEqual } = require('assert-diff')
const clone = require('../../src/clone')
const WroteContext = require('../context/WroteContext')

const { equal } = assert

const cloneTestSuite = {
    context: WroteContext,
    async 'should clone a directory'({
        FIXTURES_TEST_DIR, TEMP_TEST_DIR, readFixturesStructure,
        readTempStructure, readTemp, readFixtures,
    }) {
        await clone({
            to: TEMP_TEST_DIR,
            from: FIXTURES_TEST_DIR,
        })

        const expected = await readFixturesStructure()
        const actual = await readTempStructure()
        deepEqual(actual, expected)

        const expectedRead = await readFixtures()
        const actualRead = await readTemp()
        deepEqual(actualRead, expectedRead)
    },
    async 'should use regular expressions'({
        FIXTURES_TEST_DIR, TEMP_TEST_DIR, readFixtures,
        readTemp,
    }) {
        await clone({
            to: TEMP_TEST_DIR,
            from: FIXTURES_TEST_DIR,
            regexes: [
                {
                    re: /sys\.stderr\.write('test-file')/,
                    // eslint-disable-next-line quotes
                    replacement: "sys.stdout.write('updated-test-file')",
                },
                {
                    re: /file/g,
                    replacement: 'UFO',
                },
            ],
        })

        const expected = await readFixtures()
        expected.subdirectory['file.data'] = 'this is a UFO with some data\n'
        expected.subdirectory['file2.data'] = 'this is another UFO with some other data\n'
        expected.subdirectory2['file3.data'] = 'a UFO in another subdirectory\n'
        expected.subdirectory2.subsubdir['file4.py'] = 'sys.stderr.write(\'test-UFO\')\n'

        const actual = await readTemp()
        deepEqual(actual, expected)
    },
    async 'should throw'() {
        try {
            Error.stackTraceLimit = Infinity
            await clone({
                regexes: [
                    {
                        re: /test/,
                        replacement: 'test',
                    },
                ],
                to: 'local-dir',
                from: 'local-path-does-not-exist',
            })
            throw new Error('should have thrown')
        } catch ({ stack, code }) {
            equal(code, 'ENOENT')
            assert(/should throw/.test(stack))
        }
    },
}

module.exports = cloneTestSuite
