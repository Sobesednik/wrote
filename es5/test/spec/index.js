'use strict';

var assert = require('assert');
var Writable = require('stream').Writable;
var wrote = require('../../src/index');
var WroteContext = require('../context/WroteContext');

var wroteTestSuite = {
    context: WroteContext,
    'should be a function': function shouldBeAFunction() {
        assert(typeof wrote === 'function');
    },
    'should return a promise': function shouldReturnAPromise() {
        var res = wrote();
        assert(res instanceof Promise);
        return res.catch(function () {});
    },
    'should resolve with a write stream': function shouldResolveWithAWriteStream() {
        var res = wrote().then(function (ws) {
            assert(ws instanceof Writable);
        });
        return res;
    },
    'should open specified file': function shouldOpenSpecifiedFile(ctx) {
        var file = ctx.tempFile;
        return wrote(file).then(function (ws) {
            assert.equal(ws.path, file);
            assert(ws instanceof Writable && ws.writable);
        });
    },
    'should be able to stop stream': function shouldBeAbleToStopStream(ctx) {
        var file = ctx.tempFile;
        return wrote(file).then(function (ws) {
            var promise = new Promise(function (resolve, reject) {
                ws.once('close', function () {
                    return resolve(ws);
                });
                ws.once('error', reject);
                ws.close();
            });
            return promise;
        });
    }
};

module.exports = {
    wroteTestSuite
};