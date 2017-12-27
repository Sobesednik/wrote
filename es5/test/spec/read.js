var assert = require('assert');
var context = require('../context/WroteContext');
var read = require('../../src/read');

var readTestSuite = {
    context,
    'should read a file'(ctx) {
        return new Promise(function ($return, $error) {
            var res;
            return Promise.resolve(ctx.createTempFileWithData()).then(function ($await_3) {
                try {
                    return Promise.resolve(read(ctx.tempFile)).then(function ($await_4) {
                        try {
                            res = $await_4;
                            assert.equal(res, ctx.TEST_DATA);
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
    'should reject if file not found'() {
        return new Promise(function ($return, $error) {
            var filename, code, message;

            filename = `${Math.floor(Math.random() * 1e5)}.data`;
            var $Try_1_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_1_Catch = function (_ref) {
                try {
                    code = _ref.code;
                    message = _ref.message;

                    assert(code, 'ENOENT');
                    assert(message.indexOf(filename) !== -1);
                    return $Try_1_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);try {
                return Promise.resolve(read(filename)).then(function ($await_5) {
                    try {
                        throw new Error('should have been rejected with ENOENT');
                    } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                    }
                }.bind(this), $Try_1_Catch);
            } catch (_ref) {
                $Try_1_Catch(_ref)
            }
        }.bind(this));
    },
    'should reject if path is not a string'() {
        return new Promise(function ($return, $error) {
            var message;
            var $Try_2_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_2_Catch = function (_ref2) {
                try {
                    message = _ref2.message;

                    assert(message.indexOf('path must be a string') !== -1);
                    return $Try_2_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(read()).then(function ($await_6) {
                    try {
                        throw new Error('should have been rejected');
                    } catch ($boundEx) {
                        return $Try_2_Catch($boundEx);
                    }
                }.bind(this), $Try_2_Catch);
            } catch (_ref2) {
                $Try_2_Catch(_ref2)
            }
        }.bind(this));
    }
};

module.exports = readTestSuite;