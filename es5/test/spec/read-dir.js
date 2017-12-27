var _require = require('assert-diff'),
    deepEqual = _require.deepEqual;

var readDir = require('../../src/read-dir');
var context = require('../context/WroteContext');
var expected = require('../fixtures/expected/read-dir');

var readDirTestSuite = {
    context,
    'should read a directory': function shouldReadADirectory(ctx) {
        return readDir(ctx.FIXTURES_TEST_DIR).then(function (res) {
            deepEqual(res, expected.normal);
        });
    },
    'should read a directory recursively': function shouldReadADirectoryRecursively(ctx) {
        return readDir(ctx.FIXTURES_TEST_DIR, true).then(function (res) {
            deepEqual(res, expected.recursive);
        });
    },
    'should reject promise if directory is not found': function shouldRejectPromiseIfDirectoryIsNotFound() {
        var dirname = `${Math.floor(Math.random() * 1e5)}.data`;
        return readDir(dirname).then(function () {
            throw new Error('should have thrown an error');
        }, function (err) {
            if (!/ENOENT/.test(err.message)) {
                throw err;
            }
        });
    },
    'should reject promise if not a directory': function shouldRejectPromiseIfNotADirectory(ctx) {
        return ctx.createTempFileWithData().then(function () {
            return readDir(ctx.tempFile);
        }).then(function () {
            throw new Error('should have thrown an error');
        }, function (err) {
            if (!/ENOTDIR/.test(err.message)) {
                throw err;
            }
        });
    },
    'should throw if path is not a string': function shouldThrowIfPathIsNotAString() {
        return readDir().then(function () {
            throw new Error('should have thrown an error');
        }, function (err) {
            if (!/path must be a string/.test(err.message)) {
                throw err;
            }
        });
    }
};

module.exports = readDirTestSuite;