'use strict';

var assert = require('assert');
var Catchment = require('catchment');
var fs = require('fs');
var makePromise = require('makepromise');
var os = require('os');
var path = require('path');
var spawnCommand = require('spawncommand');
var wrote = require('../../src/');
var fixturesStructure = require('../fixtures/expected/read-dir-structure');

var FIXTURES_DIR = path.join(__dirname, '../fixtures/');
var FIXTURES_TEST_DIR = path.join(FIXTURES_DIR, 'directory');
var FIXTURES_TEST_DIR_SOFT_LINK = path.join(FIXTURES_DIR, 'directory-ln');

var TEST_NAME = `wrote-test-${Math.floor(Math.random() * 1e5)}.data`;
var createTempFilePath = function createTempFilePath() {
    return path.join(os.tmpdir(), TEST_NAME);
};

function assertFileDoesNotExist(filepath) {
    return makePromise(fs.stat, filepath).then(function () {
        throw new Error('should have been rejected');
    }, function (err) {
        assert(/^ENOENT: no such file or directory/.test(err.message));
    });
}

function assertFileExists(filepath) {
    return makePromise(fs.stat, filepath);
}

function assertCanWriteFile(filePath) {
    var testData = `some-test-data-${Date.now()}`;
    return wrote(filePath).then(function (ws) {
        return wrote.write(ws, testData);
    }).then(function () {
        var rs = fs.createReadStream(filePath);
        var catchment = new Catchment();
        rs.pipe(catchment);
        return catchment.promise;
    }).then(function (res) {
        assert.equal(res, testData);
    });
}

var TEMP_DIR = path.join(__dirname, '../temp');
var TEST_DIR_NAME = '_tests';
var TEST_DIR_NOX_NAME = 'no-execute';
var TEMP_TEST_DIR = path.join(TEMP_DIR, TEST_DIR_NAME);
var TEMP_NOX_DIR = path.join(TEMP_DIR, TEST_DIR_NOX_NAME);

function WroteContext() {
    var _this = this;

    Object.assign(this, {
        TEST_NAME,
        TEST_DATA: 'some test data for temp file'
    });
    var tempFileWs = void 0;
    Object.defineProperties(this, {
        tempFile: {
            get: function get() {
                return _this._tempFile || createTempFilePath();
            }
        },
        expectedFixturesStructure: {
            get: function get() {
                return fixturesStructure;
            }
        },
        createTempFileWithData: {
            value: function value() {
                var tempFile = createTempFilePath();
                return wrote(tempFile).then(function (ws) {
                    tempFileWs = ws;
                    return wrote.write(ws, _this.TEST_DATA);
                }).then(function () {
                    _this._tempFile = tempFile;
                });
            }
        },
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
        makeNoExecutableDirectory: {
            value: function value() {
                if (_this._TEMP_NOX_DIR) {
                    return Promise.reject(new Error('No executable directory already created'));
                }
                return makePromise(fs.mkdir, [TEMP_NOX_DIR, 0o666]).then(function () {
                    _this._TEMP_NOX_DIR = TEMP_NOX_DIR;
                }).catch(function (err) {
                    if (/EEXIST/.test(err.message)) {
                        throw new Error('WroteContext: Could not make no executable ' + 'directory: it already exists');
                    }
                });
            }
        },
        _destroy: { value: function value() {
                var promises = [];
                if (_this._TEMP_TEST_DIR && !process.env.KEEP_TEMP) {
                    var _pc = spawnCommand('rm', ['-rf', _this._TEMP_TEST_DIR]);
                    promises.push(_pc.promise);
                }
                if (_this._TEMP_NOX_DIR) {
                    var pc2 = spawnCommand('rm', ['-rf', _this._TEMP_NOX_DIR]);
                    promises.push(pc2.promise);
                }
                if (tempFileWs) {
                    var promise = wrote.erase(tempFileWs);
                    promises.push(promise);
                }
                // remove temp file
                return Promise.all(promises);
            } }
    });

    // always make temp dir available
    var pc = spawnCommand('rm', ['-rf', TEMP_TEST_DIR]);
    var p1 = pc.promise.then(function () {
        return makePromise(fs.mkdir, [TEMP_TEST_DIR, 0o777]);
    }).then(function () {
        _this._TEMP_TEST_DIR = TEMP_TEST_DIR;
    }).catch(function (err) {
        if (/EEXIST/.test(err.message)) {
            throw new Error('WroteContext: Could not make temp test ' + 'directory: it already exists');
        }
        throw err;
    });
    return Promise.all([p1]);
}

module.exports = WroteContext;