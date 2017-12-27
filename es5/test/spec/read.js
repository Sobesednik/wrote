var assert = require('assert');
var context = require('../context/WroteContext');
var read = require('../../src/read');

var readTestSuite = {
    context,
    'should read a file': function shouldReadAFile(ctx) {
        return ctx.createTempFileWithData().then(function () {
            return read(ctx.tempFile);
        }).then(function (res) {
            assert.equal(res, ctx.TEST_DATA);
        });
    },
    'should reject if file not found': function shouldRejectIfFileNotFound() {
        var filename = `${Math.floor(Math.random() * 1e5)}.data`;
        return read(filename).then(function () {
            throw new Error('should have been rejected with ENOENT');
        }, function (err) {
            if (/ENOENT/.test(err.message)) {
                assert(err.message.indexOf(filename) !== -1);
            }
        });
    },
    'should reject if path is not a string': function shouldRejectIfPathIsNotAString() {
        return read().then(function () {
            throw new Error('should have been rejected');
        }, function (err) {
            assert(err.message.indexOf('path must be a string') !== -1);
        });
    }
};

module.exports = readTestSuite;