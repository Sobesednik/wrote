var _require = require('assert-diff'),
    deepEqual = _require.deepEqual;

var assert = require('assert');
var readDir = require('../../src/read-dir');
var context = require('../context/WroteContext');
var expected = require('../fixtures/expected/read-dir');

var readDirTestSuite = {
    context,
    'should read a directory'(_ref) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, res;
            FIXTURES_TEST_DIR = _ref.FIXTURES_TEST_DIR;
            return Promise.resolve(readDir(FIXTURES_TEST_DIR)).then(function ($await_4) {
                try {
                    res = $await_4;
                    deepEqual(res, expected.normal);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should read a directory recursively'(_ref2) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, res;
            FIXTURES_TEST_DIR = _ref2.FIXTURES_TEST_DIR;
            return Promise.resolve(readDir(FIXTURES_TEST_DIR, true)).then(function ($await_5) {
                try {
                    res = $await_5;
                    deepEqual(res, expected.recursive);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should reject promise if directory is not found'() {
        return new Promise(function ($return, $error) {
            var dirname, code;

            dirname = `${Math.floor(Math.random() * 1e5)}.data`;
            var $Try_1_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_1_Catch = function (_ref3) {
                try {
                    code = _ref3.code;

                    assert.equal(code, 'ENOENT');
                    return $Try_1_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);try {
                return Promise.resolve(readDir(dirname)).then(function ($await_6) {
                    try {
                        throw new Error('should have thrown an error');
                    } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                    }
                }.bind(this), $Try_1_Catch);
            } catch (_ref3) {
                $Try_1_Catch(_ref3)
            }
        }.bind(this));
    },
    'should reject promise if not a directory'(ctx) {
        return new Promise(function ($return, $error) {
            var code;
            var $Try_2_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_2_Catch = function (_ref4) {
                try {
                    code = _ref4.code;

                    assert.equal(code, 'ENOTDIR');
                    return $Try_2_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(ctx.createTempFileWithData()).then(function ($await_7) {
                    try {
                        return Promise.resolve(readDir(ctx.tempFile)).then(function ($await_8) {
                            try {
                                throw new Error('should have thrown an error');
                            } catch ($boundEx) {
                                return $Try_2_Catch($boundEx);
                            }
                        }.bind(this), $Try_2_Catch);
                    } catch ($boundEx) {
                        return $Try_2_Catch($boundEx);
                    }
                }.bind(this), $Try_2_Catch);
            } catch (_ref4) {
                $Try_2_Catch(_ref4)
            }
        }.bind(this));
    },
    'should throw if path is not a string'() {
        return new Promise(function ($return, $error) {
            var message;
            var $Try_3_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_3_Catch = function (_ref5) {
                try {
                    message = _ref5.message;

                    assert(/path must be a string/.test(message));
                    return $Try_3_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(readDir()).then(function ($await_9) {
                    try {
                        throw new Error('should have thrown an error');
                    } catch ($boundEx) {
                        return $Try_3_Catch($boundEx);
                    }
                }.bind(this), $Try_3_Catch);
            } catch (_ref5) {
                $Try_3_Catch(_ref5)
            }
        }.bind(this));
    }
};

module.exports = readDirTestSuite;