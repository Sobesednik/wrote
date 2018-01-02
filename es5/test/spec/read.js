var _require = require('zoroaster/assert'),
    throws = _require.throws,
    equal = _require.equal,
    deepEqual = _require.deepEqual;

var context = require('../context/WroteContext');
var read = require('../../src/read');

var readTestSuite = {
    context,
    'should read a file'(_ref) {
        return new Promise(function ($return, $error) {
            var tempFile, createTempFileWithData, TEST_DATA, res;
            tempFile = _ref.tempFile, createTempFileWithData = _ref.createTempFileWithData, TEST_DATA = _ref.TEST_DATA;
            return Promise.resolve(createTempFileWithData()).then(function ($await_1) {
                try {
                    return Promise.resolve(read(tempFile)).then(function ($await_2) {
                        try {
                            res = $await_2;
                            equal(res, TEST_DATA);
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
    'should read a file in binary'(_ref2) {
        return new Promise(function ($return, $error) {
            var tempFile, createTempFileWithData, TEST_DATA_BUFFER, res;
            tempFile = _ref2.tempFile, createTempFileWithData = _ref2.createTempFileWithData, TEST_DATA_BUFFER = _ref2.TEST_DATA_BUFFER;
            return Promise.resolve(createTempFileWithData()).then(function ($await_3) {
                try {
                    return Promise.resolve(read(tempFile, { binary: true })).then(function ($await_4) {
                        try {
                            res = $await_4;
                            deepEqual(res, TEST_DATA_BUFFER);
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
            var filename;

            filename = `${Math.floor(Math.random() * 1e5)}.data`;
            return Promise.resolve(throws({
                fn: read,
                args: [filename],
                code: 'ENOENT',
                message: new RegExp(filename)
            })).then(function ($await_5) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should reject if path is not a string'() {
        return new Promise(function ($return, $error) {
            return Promise.resolve(throws({
                fn: read,
                message: /path must be a string/
            })).then(function ($await_6) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = readTestSuite;