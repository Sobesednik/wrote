var assert = require('assert');
var path = require('path');
var ensurePath = require('../../src/ensure-path');
var context = require('../context/WroteContext');

var ensurePathTestSuite = {
    context,
    'should create a path to the file'(ctx) {
        return new Promise(function ($return, $error) {
            var tempPath, res;

            tempPath = path.join(ctx.TEMP_TEST_DIR, 'path/to/temp/file.data');
            return Promise.resolve(ensurePath(tempPath)).then(function ($await_2) {
                try {
                    res = $await_2;
                    assert.equal(res, tempPath);
                    return Promise.resolve(ctx.assertCanWriteFile(tempPath)).then(function ($await_3) {
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
    'should reject when trying to create a path where cannot'(ctx) {
        return new Promise(function ($return, $error) {
            var tempPath;
            return Promise.resolve(ctx.makeNoExecutableDirectory()).then(function ($await_4) {
                try {
                    tempPath = path.join(ctx.TEMP_NOX_DIR, 'path/to/temp/file.data');
                    var $Try_1_Post = function () {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);var $Try_1_Catch = function (err) {
                        try {
                            if (!/EACCES/.test(err.message)) {
                                throw err;
                            }
                            return $Try_1_Post();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);try {
                        return Promise.resolve(ensurePath(tempPath)).then(function ($await_5) {
                            try {
                                throw new Error('should have thrown an error');
                            } catch ($boundEx) {
                                return $Try_1_Catch($boundEx);
                            }
                        }.bind(this), $Try_1_Catch);
                    } catch (err) {
                        $Try_1_Catch(err)
                    }
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should not throw an error when dir already exists'(ctx) {
        return new Promise(function ($return, $error) {
            var tempPath, res;

            tempPath = path.join(ctx.TEMP_TEST_DIR, 'file.data');
            return Promise.resolve(ensurePath(tempPath)).then(function ($await_6) {
                try {
                    res = $await_6;
                    assert.equal(res, tempPath);
                    return Promise.resolve(ctx.assertCanWriteFile(tempPath)).then(function ($await_7) {
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

module.exports = ensurePathTestSuite;