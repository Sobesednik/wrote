var assert = require('assert');

var _require = require('assert-diff'),
    deepEqual = _require.deepEqual;

var readDirStructure = require('../../src/read-dir-structure');
var context = require('../context/WroteContext');

var readDirStructureTestSuite = {
    context,
    'should read directory structure': function shouldReadDirectoryStructure(ctx) {
        return readDirStructure(ctx.FIXTURES_TEST_DIR).then(function (res) {
            deepEqual(res, ctx.expectedFixturesStructure);
        });
    },
    'should not work when directory is not passed': function shouldNotWorkWhenDirectoryIsNotPassed() {
        return readDirStructure().then(function () {
            throw new Error('should have been rejected');
        }, function (err) {
            assert.equal(err.message, 'Please specify a path to the directory');
        });
    },
    'should not work when directory does not exist': function shouldNotWorkWhenDirectoryDoesNotExist() {
        return readDirStructure('fake-directory').then(function () {
            throw new Error('should have been rejected');
        }, function (err) {
            assert.equal(err.code, 'ENOENT');
        });
    },
    'should not work when passing a path to file': function shouldNotWorkWhenPassingAPathToFile(ctx) {
        return ctx.createTempFileWithData().then(function () {
            return readDirStructure(ctx.tempFile);
        }).then(function () {
            throw new Error('should have been rejected');
        }, function (err) {
            assert.equal(err.code, 'ENOTDIR');
        });
    },
    'should not work when passing a path to soft link': function shouldNotWorkWhenPassingAPathToSoftLink(ctx) {
        return readDirStructure(ctx.FIXTURES_TEST_DIR_SOFT_LINK).then(function () {
            throw new Error('should have been rejected');
        }, function (err) {
            assert.equal(err.message, 'Path is not a directory');
            assert.equal(err.code, 'ENOTDIR');
        });
    }
};

module.exports = readDirStructureTestSuite;