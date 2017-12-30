var assert = require('assert');

var _require = require('path'),
    join = _require.join;

var exists = require('../../src/exists');
var context = require('../context/WroteContext');

var equal = assert.equal;


var eraseTestSuite = {
    context,
    'should return false for a file'(_ref) {
        return new Promise(function ($return, $error) {
            var tempFile, res;
            tempFile = _ref.tempFile;
            return Promise.resolve(exists(tempFile)).then(function ($await_2) {
                try {
                    res = $await_2;
                    assert(!res);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should return true for a file'(_ref2) {
        return new Promise(function ($return, $error) {
            var tempFile, createTempFileWithData, res;
            tempFile = _ref2.tempFile, createTempFileWithData = _ref2.createTempFileWithData;
            return Promise.resolve(createTempFileWithData()).then(function ($await_3) {
                try {
                    return Promise.resolve(exists(tempFile)).then(function ($await_4) {
                        try {
                            res = $await_4;
                            assert(res);
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
    },
    'should return true for a directory'(_ref3) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, res;
            FIXTURES_TEST_DIR = _ref3.FIXTURES_TEST_DIR;
            return Promise.resolve(exists(FIXTURES_TEST_DIR)).then(function ($await_5) {
                try {
                    res = $await_5;
                    assert(res);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should throw a permission denied error'(_ref4) {
        return new Promise(function ($return, $error) {
            var makeNoExecutableDirectory, temp, test, code;
            makeNoExecutableDirectory = _ref4.makeNoExecutableDirectory;
            return Promise.resolve(makeNoExecutableDirectory()).then(function ($await_6) {
                try {
                    temp = $await_6;
                    test = join(temp, 'test/wrote.data');
                    var $Try_1_Post = function () {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);var $Try_1_Catch = function (_ref5) {
                        try {
                            code = _ref5.code;

                            equal(code, 'EACCES');
                            return $Try_1_Post();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);try {
                        return Promise.resolve(exists(test)).then(function ($await_7) {
                            try {
                                throw new Error('should have thrown');
                            } catch ($boundEx) {
                                return $Try_1_Catch($boundEx);
                            }
                        }.bind(this), $Try_1_Catch);
                    } catch (_ref5) {
                        $Try_1_Catch(_ref5)
                    }
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = eraseTestSuite;