var assert = require('assert');

var _require = require('assert-diff'),
    deepEqual = _require.deepEqual;

var readDirStructure = require('../../src/read-dir-structure');
var context = require('../context/WroteContext');

var readDirStructureTestSuite = {
    context,
    'should read directory structure'(_ref) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, expectedFixturesStructure, res;
            FIXTURES_TEST_DIR = _ref.FIXTURES_TEST_DIR, expectedFixturesStructure = _ref.expectedFixturesStructure;
            return Promise.resolve(readDirStructure(FIXTURES_TEST_DIR)).then(function ($await_5) {
                try {
                    res = $await_5;
                    deepEqual(res, expectedFixturesStructure);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should not work when directory is not passed'() {
        return new Promise(function ($return, $error) {
            var message;
            var $Try_1_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_1_Catch = function (_ref2) {
                try {
                    message = _ref2.message;

                    assert.equal(message, 'Please specify a path to the directory');
                    return $Try_1_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(readDirStructure()).then(function ($await_6) {
                    try {
                        throw new Error('should have been rejected');
                    } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                    }
                }.bind(this), $Try_1_Catch);
            } catch (_ref2) {
                $Try_1_Catch(_ref2)
            }
        }.bind(this));
    },
    'should not work when directory does not exist'() {
        return new Promise(function ($return, $error) {
            var code;
            var $Try_2_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_2_Catch = function (_ref3) {
                try {
                    code = _ref3.code;

                    assert.equal(code, 'ENOENT');
                    return $Try_2_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(readDirStructure('fake-directory')).then(function ($await_7) {
                    try {
                        throw new Error('should have been rejected');
                    } catch ($boundEx) {
                        return $Try_2_Catch($boundEx);
                    }
                }.bind(this), $Try_2_Catch);
            } catch (_ref3) {
                $Try_2_Catch(_ref3)
            }
        }.bind(this));
    },
    'should not work when passing a path to file'(ctx) {
        return new Promise(function ($return, $error) {
            var code;
            var $Try_3_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_3_Catch = function (_ref4) {
                try {
                    code = _ref4.code;

                    assert.equal(code, 'ENOTDIR');
                    return $Try_3_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(ctx.createTempFileWithData()).then(function ($await_8) {
                    try {
                        return Promise.resolve(readDirStructure(ctx.tempFile)).then(function ($await_9) {
                            try {
                                throw new Error('should have been rejected');
                            } catch ($boundEx) {
                                return $Try_3_Catch($boundEx);
                            }
                        }.bind(this), $Try_3_Catch);
                    } catch ($boundEx) {
                        return $Try_3_Catch($boundEx);
                    }
                }.bind(this), $Try_3_Catch);
            } catch (_ref4) {
                $Try_3_Catch(_ref4)
            }
        }.bind(this));
    },
    'should not work when passing a path to soft link'(ctx) {
        return new Promise(function ($return, $error) {
            var message, code;
            var $Try_4_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_4_Catch = function (_ref5) {
                try {
                    message = _ref5.message;
                    code = _ref5.code;

                    assert.equal(message, 'Path is not a directory');
                    assert.equal(code, 'ENOTDIR');
                    return $Try_4_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(readDirStructure(ctx.FIXTURES_TEST_DIR_SOFT_LINK)).then(function ($await_10) {
                    try {
                        throw new Error('should have been rejected');
                    } catch ($boundEx) {
                        return $Try_4_Catch($boundEx);
                    }
                }.bind(this), $Try_4_Catch);
            } catch (_ref5) {
                $Try_4_Catch(_ref5)
            }
        }.bind(this));
    }
};

module.exports = readDirStructureTestSuite;