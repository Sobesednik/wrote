var assert = require('assert');

var _require = require('path'),
    join = _require.join;

var assertExists = require('../../src/assert-exists');
var context = require('../context/WroteContext');

var equal = assert.equal;


var eraseTestSuite = {
    context,
    'should throw an error for a file'(_ref) {
        return new Promise(function ($return, $error) {
            var tempFile, message;
            tempFile = _ref.tempFile;
            var $Try_1_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_1_Catch = function (_ref2) {
                try {
                    message = _ref2.message;

                    equal(message, `Path ${tempFile} does not exist.`);
                    return $Try_1_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(assertExists(tempFile)).then(function ($await_3) {
                    try {
                        throw new Error('should have thrown');
                    } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                    }
                }.bind(this), $Try_1_Catch);
            } catch (_ref2) {
                $Try_1_Catch(_ref2)
            }
        }.bind(this));
    },
    'should pass for a file'(_ref3) {
        return new Promise(function ($return, $error) {
            var tempFile, createTempFileWithData;
            tempFile = _ref3.tempFile, createTempFileWithData = _ref3.createTempFileWithData;
            return Promise.resolve(createTempFileWithData()).then(function ($await_4) {
                try {
                    return Promise.resolve(assertExists(tempFile)).then(function ($await_5) {
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
    },
    'should pass for a directory'(_ref4) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR;
            FIXTURES_TEST_DIR = _ref4.FIXTURES_TEST_DIR;
            return Promise.resolve(assertExists(FIXTURES_TEST_DIR)).then(function ($await_6) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should throw a permission denied error'(_ref5) {
        return new Promise(function ($return, $error) {
            var makeNoExecutableDirectory, temp, test, code;
            makeNoExecutableDirectory = _ref5.makeNoExecutableDirectory;
            return Promise.resolve(makeNoExecutableDirectory()).then(function ($await_7) {
                try {
                    temp = $await_7;
                    test = join(temp, 'test/wrote.data');
                    var $Try_2_Post = function () {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);var $Try_2_Catch = function (_ref6) {
                        try {
                            code = _ref6.code;

                            equal(code, 'EACCES');
                            return $Try_2_Post();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);try {
                        return Promise.resolve(assertExists(test)).then(function ($await_8) {
                            try {
                                throw new Error('should have thrown');
                            } catch ($boundEx) {
                                return $Try_2_Catch($boundEx);
                            }
                        }.bind(this), $Try_2_Catch);
                    } catch (_ref6) {
                        $Try_2_Catch(_ref6)
                    }
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = eraseTestSuite;