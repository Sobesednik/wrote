const assert = require('assert')
const Catchment = require('catchment')
const fs = require('fs')
const makePromise = require('makepromise')
const { tmpdir } = require('os')
const { resolve } = require('path')
const spawnCommand = require('spawncommand')
const {
    createWritable, write, erase, readDir, readDirStructure, read,
} = require('../../src/')
const fixturesStructure = require('../fixtures/expected/read-dir-structure')
const expectedJSON = require('../fixtures/test.json')

const FIXTURES_DIR = resolve(__dirname, '../fixtures/')
const FIXTURES_TEST_DIR = resolve(FIXTURES_DIR, 'directory')
const FIXTURES_TEST_DIR_SOFT_LINK = resolve(FIXTURES_DIR, 'directory-ln')

const TEST_NAME = `wrote-test-${Math.floor(Math.random() * 1e5)}.data`

const createTempFilePath = () => resolve(tmpdir(), TEST_NAME)

async function assertFileDoesNotExist(path) {
    try {
        await makePromise(fs.stat, path)
        throw new Error('should have been rejected')
    } catch ({ message }) {
        assert(/^ENOENT: no such file or directory/.test(message))
    }
}

async function assertFileExists(path) {
    await makePromise(fs.stat, path)
}

async function assertCanWriteFile(path) {
    const testData = `some-test-data-${Date.now()}`
    const ws = await createWritable(path)
    await write(ws, testData)
    const rs = fs.createReadStream(path)

    const { promise } = new Catchment({ rs })
    const res = await promise
    assert.equal(res, testData)
}

const TEMP_DIR = resolve(__dirname, '../temp')
const TEST_DIR_NAME = '_tests'
const TEST_DIR_NOX_NAME = 'no-execute'
const TEMP_TEST_DIR = resolve(TEMP_DIR, TEST_DIR_NAME)
const TEMP_NOX_DIR = resolve(TEMP_DIR, TEST_DIR_NOX_NAME)

async function WroteContext() {
    this.read = read
    this.expectedJSON = expectedJSON
    this.JSONpath = resolve(FIXTURES_DIR, 'test.json')
    this.invalidJSONpath = resolve(FIXTURES_DIR, 'invalid.json')

    Object.assign(this, {
        TEST_NAME,
        TEST_DATA: 'some test data for temp file',
    })
    let tempFileWs
    Object.defineProperties(this, {
        readDir: {
            async value(...args) {
                const res = await readDir(...args)
                return res
            },
        },
        readDirStructure: {
            async value(...args) {
                const res = await readDirStructure(...args)
                return res
            },
        },
        readFixturesStructure: {
            async value() {
                const res = await readDirStructure(FIXTURES_TEST_DIR)
                return res
            },
        },
        readTempStructure: {
            async value() {
                const res = await readDirStructure(TEMP_TEST_DIR)
                return res
            },
        },
        readTemp: {
            async value() {
                const res = await readDir(TEMP_TEST_DIR, true)
                return res
            },
        },
        readFixtures: {
            async value() {
                const res = await readDir(FIXTURES_TEST_DIR, true)
                return res
            },
        },
        tempFile: {
            get() {
                return this._tempFile || createTempFilePath()
            },
        },
        expectedFixturesStructure: {
            get() { return fixturesStructure },
        },
        createTempFileWithData: { async value() {
            const tempFile = createTempFilePath()
            const ws = await createWritable(tempFile)
            tempFileWs = ws
            await write(ws, this.TEST_DATA)
            this._tempFile = tempFile
        }},
        assertFileDoesNotExist: {
            get: () => assertFileDoesNotExist,
        },
        assertFileExists: {
            get: () => assertFileExists,
        },
        assertCanWriteFile: {
            get: () => assertCanWriteFile,
        },
        TEMP_DIR: {
            get: () => TEMP_DIR,
        },
        FIXTURES_TEST_DIR: {
            get: () => FIXTURES_TEST_DIR,
        },
        FIXTURES_TEST_DIR_SOFT_LINK: {
            get: () => FIXTURES_TEST_DIR_SOFT_LINK,
        },
        READ_DIR: {
            get: () => TEMP_DIR,
        },
        TEMP_TEST_DIR: {
            get: () => {
                if (!this._TEMP_TEST_DIR) {
                    throw new Error('Temp dir was not created')
                }
                return this._TEMP_TEST_DIR
            },
        },
        TEMP_NOX_DIR: {
            get: () => {
                if (!this._TEMP_NOX_DIR) {
                    throw new Error('Call makeNoExecutableDirectory to access this property first')
                }
                return this._TEMP_NOX_DIR
            },
        },
        makeNoExecutableDirectory: { value: async () => {
            if (this._TEMP_NOX_DIR) {
                throw new Error('No executable directory already created')
            }
            try {
                await makePromise(fs.mkdir, [TEMP_NOX_DIR, 0o666])
                this._TEMP_NOX_DIR = TEMP_NOX_DIR
                return TEMP_NOX_DIR
            } catch ({ message }) {
                if (/EEXIST/.test(message)) {
                    throw new Error('WroteContext: Could not make no executable directory: it already exists')
                }
            }
        }},
        _destroy: { value: async () => {
            const promises = []
            if (this._TEMP_TEST_DIR && !process.env.KEEP_TEMP) {
                const pc = spawnCommand('rm', ['-rf', this._TEMP_TEST_DIR])
                promises.push(pc.promise)
            }
            if (this._TEMP_NOX_DIR) {
                const pc2 = spawnCommand('rm', ['-rf', this._TEMP_NOX_DIR])
                promises.push(pc2.promise)
            }
            if (tempFileWs) {
                const promise = erase(tempFileWs)
                promises.push(promise)
            }
            // remove temp file
            await Promise.all(promises)
        }},
    })

    // always make temp dir available
    try {
        const { promise } = spawnCommand('rm', ['-rf', TEMP_TEST_DIR])
        await promise
        await makePromise(fs.mkdir, [TEMP_TEST_DIR, 0o777])
        this._TEMP_TEST_DIR = TEMP_TEST_DIR
    } catch (err) {
        if (/EEXIST/.test(err.message)) {
            throw new Error('WroteContext: Could not make temp test directory: it already exists.')
        }
        throw err
    }
}

module.exports = WroteContext
