var assert = require('assert');
var Catchment = require('catchment');
var fs = require('fs');
var makePromise = require('makepromise');

var _require = require('os'),
    tmpdir = _require.tmpdir;

var _require2 = require('path'),
    resolve = _require2.resolve;

var spawnCommand = require('spawncommand');

var _require3 = require('../../src/'),
    createWritable = _require3.createWritable,
    write = _require3.write,
    erase = _require3.erase;

var fixturesStructure = require('../fixtures/expected/read-dir-structure');

var FIXTURES_DIR = resolve(__dirname, '../fixtures/');
var FIXTURES_TEST_DIR = resolve(FIXTURES_DIR, 'directory');
var FIXTURES_TEST_DIR_SOFT_LINK = resolve(FIXTURES_DIR, 'directory-ln');

var TEST_NAME = `wrote-test-${Math.floor(Math.random() * 1e5)}.data`;

var createTempFilePath = function createTempFilePath() {
    return resolve(tmpdir(), TEST_NAME);
};

function assertFileDoesNotExist(path) {
    return new Promise(function ($return, $error) {
        var message;
        var $Try_1_Post = function () {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);var $Try_1_Catch = function (_ref) {
            try {
                message = _ref.message;

                assert(/^ENOENT: no such file or directory/.test(message));
                return $Try_1_Post();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);
        try {
            return Promise.resolve(makePromise(fs.stat, path)).then(function ($await_4) {
                try {
                    throw new Error('should have been rejected');
                } catch ($boundEx) {
                    return $Try_1_Catch($boundEx);
                }
            }.bind(this), $Try_1_Catch);
        } catch (_ref) {
            $Try_1_Catch(_ref)
        }
    }.bind(this));
}

function assertFileExists(path) {
    return new Promise(function ($return, $error) {
        return Promise.resolve(makePromise(fs.stat, path)).then(function ($await_5) {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

function assertCanWriteFile(path) {
    return new Promise(function ($return, $error) {
        var testData, ws, rs, catchment, res;

        testData = `some-test-data-${Date.now()}`;
        return Promise.resolve(createWritable(path)).then(function ($await_6) {
            try {
                ws = $await_6;
                return Promise.resolve(write(ws, testData)).then(function ($await_7) {
                    try {
                        rs = fs.createReadStream(path);

                        catchment = new Catchment();
                        rs.pipe(catchment);
                        return Promise.resolve(catchment.promise).then(function ($await_8) {
                            try {
                                res = $await_8;
                                assert.equal(res, testData);
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
}

var TEMP_DIR = resolve(__dirname, '../temp');
var TEST_DIR_NAME = '_tests';
var TEST_DIR_NOX_NAME = 'no-execute';
var TEMP_TEST_DIR = resolve(TEMP_DIR, TEST_DIR_NAME);
var TEMP_NOX_DIR = resolve(TEMP_DIR, TEST_DIR_NOX_NAME);

function WroteContext() {
    return new Promise(function ($return, $error) {
        var _this, tempFileWs, _spawnCommand, promise;

        _this = this;

        Object.assign(this, {
            TEST_NAME,
            TEST_DATA: 'some test data for temp file'
        });
        tempFileWs = void 0;
        Object.defineProperties(this, {
            tempFile: {
                get() {
                    return this._tempFile || createTempFilePath();
                }
            },
            expectedFixturesStructure: {
                get() {
                    return fixturesStructure;
                }
            },
            createTempFileWithData: { value() {
                    return new Promise(function ($return, $error) {
                        var tempFile, ws;

                        tempFile = createTempFilePath();
                        return Promise.resolve(createWritable(tempFile)).then(function ($await_9) {
                            try {
                                ws = $await_9;
                                tempFileWs = ws;
                                return Promise.resolve(write(ws, this.TEST_DATA)).then(function ($await_10) {
                                    try {
                                        this._tempFile = tempFile;
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
                } },
            assertFileDoesNotExist: {
                get: function get() {
                    return assertFileDoesNotExist;
                }
            },
            assertFileExists: {
                get: function get() {
                    return assertFileExists;
                }
            },
            assertCanWriteFile: {
                get: function get() {
                    return assertCanWriteFile;
                }
            },
            TEMP_DIR: {
                get: function get() {
                    return TEMP_DIR;
                }
            },
            FIXTURES_TEST_DIR: {
                get: function get() {
                    return FIXTURES_TEST_DIR;
                }
            },
            FIXTURES_TEST_DIR_SOFT_LINK: {
                get: function get() {
                    return FIXTURES_TEST_DIR_SOFT_LINK;
                }
            },
            READ_DIR: {
                get: function get() {
                    return TEMP_DIR;
                }
            },
            TEMP_TEST_DIR: {
                get: function get() {
                    if (!_this._TEMP_TEST_DIR) {
                        throw new Error('Temp dir was not created');
                    }
                    return _this._TEMP_TEST_DIR;
                }
            },
            TEMP_NOX_DIR: {
                get: function get() {
                    if (!_this._TEMP_NOX_DIR) {
                        throw new Error('Call makeNoExecutableDirectory to access this property first');
                    }
                    return _this._TEMP_NOX_DIR;
                }
            },
            makeNoExecutableDirectory: { value() {
                    return new Promise(function ($return, $error) {
                        var message;

                        if (this._TEMP_NOX_DIR) {
                            return $return(Promise.reject(new Error('No executable directory already created')));
                        }
                        var $Try_2_Post = function () {
                            try {
                                return $return();
                            } catch ($boundEx) {
                                return $error($boundEx);
                            }
                        }.bind(this);var $Try_2_Catch = function (_ref2) {
                            try {
                                message = _ref2.message;

                                if (/EEXIST/.test(message)) {
                                    throw new Error('WroteContext: Could not make no executable directory: it already exists');
                                }
                                return $Try_2_Post();
                            } catch ($boundEx) {
                                return $error($boundEx);
                            }
                        }.bind(this);try {
                            return Promise.resolve(makePromise(fs.mkdir, [TEMP_NOX_DIR, 0o666])).then(function ($await_11) {
                                try {
                                    this._TEMP_NOX_DIR = TEMP_NOX_DIR;
                                    return $Try_2_Post();
                                } catch ($boundEx) {
                                    return $Try_2_Catch($boundEx);
                                }
                            }.bind(this), $Try_2_Catch);
                        } catch (_ref2) {
                            $Try_2_Catch(_ref2)
                        }
                    }.bind(this));
                } },
            _destroy: { value() {
                    return new Promise(function ($return, $error) {
                        var promises, pc, pc2, promise;

                        promises = [];
                        if (this._TEMP_TEST_DIR && !process.env.KEEP_TEMP) {
                            pc = spawnCommand('rm', ['-rf', this._TEMP_TEST_DIR]);
                            promises.push(pc.promise);
                        }
                        if (this._TEMP_NOX_DIR) {
                            pc2 = spawnCommand('rm', ['-rf', this._TEMP_NOX_DIR]);
                            promises.push(pc2.promise);
                        }
                        if (tempFileWs) {
                            promise = erase(tempFileWs);
                            promises.push(promise);
                        }
                        // remove temp file
                        return Promise.resolve(Promise.all(promises)).then(function ($await_12) {
                            try {
                                return $return();
                            } catch ($boundEx) {
                                return $error($boundEx);
                            }
                        }.bind(this), $error);
                    }.bind(this));
                } }
        });

        // always make temp dir available
        var $Try_3_Post = function () {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);var $Try_3_Catch = function (err) {
            try {
                if (/EEXIST/.test(err.message)) {
                    throw new Error('WroteContext: Could not make temp test directory: it already exists.');
                }
                throw err;
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);try {
            _spawnCommand = spawnCommand('rm', ['-rf', TEMP_TEST_DIR]), promise = _spawnCommand.promise;
            return Promise.resolve(promise).then(function ($await_13) {
                try {
                    return Promise.resolve(makePromise(fs.mkdir, [TEMP_TEST_DIR, 0o777])).then(function ($await_14) {
                        try {
                            this._TEMP_TEST_DIR = TEMP_TEST_DIR;
                            return $Try_3_Post();
                        } catch ($boundEx) {
                            return $Try_3_Catch($boundEx);
                        }
                    }.bind(this), $Try_3_Catch);
                } catch ($boundEx) {
                    return $Try_3_Catch($boundEx);
                }
            }.bind(this), $Try_3_Catch);
        } catch (err) {
            $Try_3_Catch(err)
        }
    }.bind(this));
}

module.exports = WroteContext;