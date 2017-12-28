var assert = require('assert');

var _require = require('stream'),
    Writable = _require.Writable;

var wrote = require('../../src/wrote');
var WroteContext = require('../context/WroteContext');

var wroteTestSuite = {
    context: WroteContext,
    'should be a function': function shouldBeAFunction() {
        assert(typeof wrote === 'function');
    },
    'should return a promise'() {
        return new Promise(function ($return, $error) {
            var res;

            res = wrote();
            assert(res instanceof Promise);
            return Promise.resolve(res).then(function ($await_1) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should resolve with a write stream'() {
        return new Promise(function ($return, $error) {
            var ws;
            return Promise.resolve(wrote()).then(function ($await_2) {
                try {
                    ws = $await_2;
                    assert(ws instanceof Writable);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should open specified file'(_ref) {
        return new Promise(function ($return, $error) {
            var tempFile, ws;
            tempFile = _ref.tempFile;
            return Promise.resolve(wrote(tempFile)).then(function ($await_3) {
                try {
                    ws = $await_3;
                    assert.equal(ws.path, tempFile);
                    assert(ws instanceof Writable);
                    assert(ws.writable);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should be able to close the stream'(_ref2) {
        return new Promise(function ($return, $error) {
            var tempFile, ws;
            tempFile = _ref2.tempFile;
            return Promise.resolve(wrote(tempFile)).then(function ($await_4) {
                try {
                    ws = $await_4;
                    return Promise.resolve(new Promise(function (resolve, reject) {
                        ws.once('close', function () {
                            return resolve(ws);
                        });
                        ws.once('error', reject);
                        ws.close();
                    })).then(function ($await_5) {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this), $error);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = {
    wroteTestSuite
};