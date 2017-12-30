var assert = require('assert');

var _require = require('path'),
    join = _require.join;

var assertDoesNotExist = require('../../src/assert-does-not-exist');
var context = require('../context/WroteContext');

var equal = assert.equal;


var eraseTestSuite = {
    context,
    'should pass for a file'(_ref) {
        return new Promise(function ($return, $error) {
            var tempFile;
            tempFile = _ref.tempFile;
            return Promise.resolve(assertDoesNotExist(tempFile)).then(function ($await_4) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should throw for a file'(_ref2) {
        return new Promise(function ($return, $error) {
            var tempFile, createTempFileWithData, message;
            tempFile = _ref2.tempFile, createTempFileWithData = _ref2.createTempFileWithData;
            return Promise.resolve(createTempFileWithData()).then(function ($await_5) {
                try {
                    var $Try_1_Post = function () {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);var $Try_1_Catch = function (_ref3) {
                        try {
                            message = _ref3.message;

                            equal(message, `Path ${tempFile} exists.`);
                            return $Try_1_Post();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);
                    try {
                        return Promise.resolve(assertDoesNotExist(tempFile)).then(function ($await_6) {
                            try {
                                return $Try_1_Post();
                            } catch ($boundEx) {
                                return $Try_1_Catch($boundEx);
                            }
                        }.bind(this), $Try_1_Catch);
                    } catch (_ref3) {
                        $Try_1_Catch(_ref3)
                    }
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should throw for a directory'(_ref4) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, message;
            FIXTURES_TEST_DIR = _ref4.FIXTURES_TEST_DIR;
            var $Try_2_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_2_Catch = function (_ref5) {
                try {
                    message = _ref5.message;

                    equal(message, `Path ${FIXTURES_TEST_DIR} exists.`);
                    return $Try_2_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(assertDoesNotExist(FIXTURES_TEST_DIR)).then(function ($await_7) {
                    try {
                        return $Try_2_Post();
                    } catch ($boundEx) {
                        return $Try_2_Catch($boundEx);
                    }
                }.bind(this), $Try_2_Catch);
            } catch (_ref5) {
                $Try_2_Catch(_ref5)
            }
        }.bind(this));
    },
    'should throw a permission denied error'(_ref6) {
        return new Promise(function ($return, $error) {
            var makeNoExecutableDirectory, temp, test, code;
            makeNoExecutableDirectory = _ref6.makeNoExecutableDirectory;
            return Promise.resolve(makeNoExecutableDirectory()).then(function ($await_8) {
                try {
                    temp = $await_8;
                    test = join(temp, 'test/wrote.data');
                    var $Try_3_Post = function () {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);var $Try_3_Catch = function (_ref7) {
                        try {
                            code = _ref7.code;

                            equal(code, 'EACCES');
                            return $Try_3_Post();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);try {
                        return Promise.resolve(assertDoesNotExist(test)).then(function ($await_9) {
                            try {
                                throw new Error('should have thrown');
                            } catch ($boundEx) {
                                return $Try_3_Catch($boundEx);
                            }
                        }.bind(this), $Try_3_Catch);
                    } catch (_ref7) {
                        $Try_3_Catch(_ref7)
                    }
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = eraseTestSuite;