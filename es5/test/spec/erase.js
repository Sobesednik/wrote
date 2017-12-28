var assert = require('assert');
var makePromise = require('makepromise');
var erase = require('../../src/erase');
var createWritable = require('../../src/create-writable');
var context = require('../context/WroteContext');

var eraseTestSuite = {
    context,
    'should close and erase open stream'(_ref) {
        return new Promise(function ($return, $error) {
            var tempFile, assertFileDoesNotExist, ws;
            tempFile = _ref.tempFile, assertFileDoesNotExist = _ref.assertFileDoesNotExist;
            return Promise.resolve(createWritable(tempFile)).then(function ($await_1) {
                try {
                    ws = $await_1;
                    assert(!ws.closed);
                    return Promise.resolve(erase(ws)).then(function ($await_2) {
                        try {
                            assert(ws.closed); // if node 6+, assert writable == false
                            assert.equal(ws.path, tempFile);
                            return Promise.resolve(assertFileDoesNotExist(tempFile)).then(function ($await_3) {
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
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should close and erase temp open stream'(_ref2) {
        return new Promise(function ($return, $error) {
            var assertFileDoesNotExist, ws;
            assertFileDoesNotExist = _ref2.assertFileDoesNotExist;
            return Promise.resolve(createWritable()).then(function ($await_4) {
                try {
                    ws = $await_4;
                    assert(!ws.closed);
                    return Promise.resolve(erase(ws)).then(function ($await_5) {
                        try {
                            assert(ws.closed);
                            return Promise.resolve(assertFileDoesNotExist(ws.path)).then(function ($await_6) {
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
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should erase closed stream'(_ref3) {
        return new Promise(function ($return, $error) {
            var tempFile, assertFileExists, assertFileDoesNotExist, ws;
            tempFile = _ref3.tempFile, assertFileExists = _ref3.assertFileExists, assertFileDoesNotExist = _ref3.assertFileDoesNotExist;
            return Promise.resolve(createWritable(tempFile)).then(function ($await_7) {
                try {
                    ws = $await_7;
                    return Promise.resolve(makePromise(ws.end.bind(ws))).then(function ($await_8) {
                        try {
                            assert(ws.closed);
                            return Promise.resolve(assertFileExists(tempFile)).then(function ($await_9) {
                                try {
                                    return Promise.resolve(erase(ws)).then(function ($await_10) {
                                        try {
                                            return Promise.resolve(assertFileDoesNotExist(tempFile)).then(function ($await_11) {
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
                                } catch ($boundEx) {
                                    return $error($boundEx);
                                }
                            }.bind(this), $error);
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

module.exports = eraseTestSuite;