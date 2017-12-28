var assert = require('assert');
var ensurePath = require('../../src/ensure-path');
var erase = require('../../src/erase');
var wrote = require('../../src/');
var read = require('../../src/read');
var readDir = require('../../src/read-dir');
var write = require('../../src/write');
var readDirStructure = require('../../src/read-dir-structure');
var createWritable = require('../../src/create-writable');
var api = require('../../src/');

var apiTestSuite = {
    '0.1.0 should export wrote': function shouldExportWrote() {
        assert.strictEqual(api, wrote);
    },
    '0.2.0 should export erase': function shouldExportErase() {
        assert.strictEqual(api.erase, erase);
    },
    '0.3.0 should export write': function shouldExportWrite() {
        assert.strictEqual(api.write, write);
    },
    '0.4.0 should export ensurePath': function shouldExportEnsurePath() {
        assert.strictEqual(api.ensurePath, ensurePath);
    },
    '0.5.0 should export read': function shouldExportRead() {
        assert.strictEqual(api.read, read);
    },
    '0.6.0 should export readDir': function shouldExportReadDir() {
        assert.strictEqual(api.readDir, readDir);
    },
    '0.7.0 should export readDirStructure': function shouldExportReadDirStructure() {
        assert.strictEqual(api.readDirStructure, readDirStructure);
    },
    '1.0.0 should export an object and createWritable instead of wrote'() {
        assert(typeof api === 'object');
        assert.strictEqual(api.createWritable, createWritable);
    }
};

module.exports = apiTestSuite;