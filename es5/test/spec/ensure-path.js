var assert = require('assert');
var path = require('path');
var ensurePath = require('../../src/ensure-path');
var context = require('../context/WroteContext');

var ensurePathTestSuite = {
    context,
    'should create a path to the file': function shouldCreateAPathToTheFile(ctx) {
        var tempPath = path.join(ctx.TEMP_TEST_DIR, 'path/to/temp/file.data');
        return ensurePath(tempPath).then(function (res) {
            assert.equal(res, tempPath);
            return ctx.assertCanWriteFile(tempPath);
        });
    },
    'should reject when trying to create a path where cannot': function shouldRejectWhenTryingToCreateAPathWhereCannot(ctx) {
        return ctx.makeNoExecutableDirectory().then(function () {
            var tempPath = path.join(ctx.TEMP_NOX_DIR, 'path/to/temp/file.data');
            return ensurePath(tempPath);
        }).then(function () {
            throw new Error('should have thrown an error');
        }).catch(function (err) {
            if (!/EACCES/.test(err.message)) {
                throw err;
            }
        });
    },
    'should not throw an error when dir already exists': function shouldNotThrowAnErrorWhenDirAlreadyExists(ctx) {
        var tempPath = path.join(ctx.TEMP_TEST_DIR, 'file.data');
        return ensurePath(tempPath).then(function (res) {
            assert.equal(res, tempPath);
            return ctx.assertCanWriteFile(tempPath);
        });
    }
};

module.exports = ensurePathTestSuite;