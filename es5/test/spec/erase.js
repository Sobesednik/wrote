'use strict';

var assert = require('assert');
var makePromise = require('makepromise');
var erase = require('../../src/erase');
var wrote = require('../../src/wrote');
var WroteContext = require('../context/WroteContext');

var eraseTestSuite = {
    context: WroteContext,
    'should erase passed file': function shouldErasePassedFile(ctx) {
        var file = ctx.tempFile;
        return wrote(file).then(function (ws) {
            return erase(ws);
        }).then(function (ws) {
            assert(ws.closed); // if node 6+, assert writable == false
            assert.equal(ws.path, file);
        }).then(function () {
            return ctx.assertFileDoesNotExist(file);
        });
    },
    'should erase temp file': function shouldEraseTempFile(ctx) {
        var file = void 0;
        var writeStream = void 0;

        return wrote().then(function (ws) {
            writeStream = ws;
            file = writeStream.path;
            return erase(writeStream);
        }).then(function () {
            assert(writeStream.closed);
            assert.equal(writeStream.path, file);
        }).then(function () {
            return ctx.assertFileDoesNotExist(file);
        });
    },
    'should erase file even if stream is closed': function shouldEraseFileEvenIfStreamIsClosed(ctx) {
        var file = ctx.tempFile;
        var writeStream = void 0;
        return wrote(file).then(function (ws) {
            writeStream = ws;
            return makePromise(writeStream.end.bind(writeStream));
        }).then(function () {
            assert(writeStream.closed);
            assert.equal(writeStream.path, file);
        }).then(function () {
            return ctx.assertFileExists(file);
        }).then(function () {
            return erase(writeStream);
        }).then(function () {
            return ctx.assertFileDoesNotExist(file);
        });
    }
};

module.exports = eraseTestSuite;