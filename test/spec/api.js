const assert = require('assert')
const ensurePath = require('../../src/ensure-path')
const erase = require('../../src/erase')
const wrote = require('../../src/')
const read = require('../../src/read')
const readDir = require('../../src/read-dir')
const write = require('../../src/write')
const readDirStructure = require('../../src/read-dir-structure')
const createWritable = require('../../src/create-writable')
const clone = require('../../src/clone')
const exists = require('../../src/exists')
const assertExists = require('../../src/assert-exists')
const assertDoesNotExist = require('../../src/assert-does-not-exist')
const readJSON = require('../../src/read-json')
const writeJSON = require('../../src/write-json')
const api = require('../../')

const apiTestSuite = {
    '0.1.0 should export wrote': () => {
        assert.strictEqual(api, wrote)
    },
    '0.2.0 should export erase': () => {
        assert.strictEqual(api.erase, erase)
    },
    '0.3.0 should export write': () => {
        assert.strictEqual(api.write, write)
    },
    '0.4.0 should export ensurePath': () => {
        assert.strictEqual(api.ensurePath, ensurePath)
    },
    '0.5.0 should export read': () => {
        assert.strictEqual(api.read, read)
    },
    '0.6.0 should export readDir': () => {
        assert.strictEqual(api.readDir, readDir)
    },
    '0.7.0 should export readDirStructure': () => {
        assert.strictEqual(api.readDirStructure, readDirStructure)
    },
    '1.0.0 should export an object and createWritable instead of wrote'() {
        assert(typeof api === 'object')
        assert.strictEqual(api.createWritable, createWritable)
    },
    '1.1.0 should export clone'() {
        assert.strictEqual(api.clone, clone)
    },
    '1.2.0 should export exists, assertExists, assertDoesNotExist'() {
        assert.strictEqual(api.exists, exists)
        assert.strictEqual(api.assertExists, assertExists)
        assert.strictEqual(api.assertDoesNotExist, assertDoesNotExist)
    },
    '1.3.0 should export readJSON, writeJSON'() {
        assert.strictEqual(api.readJSON, readJSON)
        assert.strictEqual(api.writeJSON, writeJSON)
    },
}

module.exports = apiTestSuite
