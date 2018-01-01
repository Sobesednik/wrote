var _require = require('zoroaster/assert'),
    deepEqual = _require.deepEqual,
    equal = _require.equal;

var _require2 = require('path'),
    resolve = _require2.resolve;

var context = require('../context/WroteContext');
var writeJSON = require('../../src/write-json');

var expectedJSONWithSpaces = `{
  "json": true,
  "test": "data",
  "date": null
}`;

var readJSONTestSuite = {
    context,
    'should write JSON to a file'(_ref) {
        return new Promise(function ($return, $error) {
            var expectedJSON, TEMP_TEST_DIR, file, actual;
            expectedJSON = _ref.expectedJSON, TEMP_TEST_DIR = _ref.TEMP_TEST_DIR;

            file = resolve(TEMP_TEST_DIR, 'test.json');
            return Promise.resolve(writeJSON(file, expectedJSON)).then(function ($await_1) {
                try {
                    actual = require(file);
                    deepEqual(actual, expectedJSON);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should not use spaces'(_ref2) {
        return new Promise(function ($return, $error) {
            var expectedJSON, TEMP_TEST_DIR, read, file, res;
            expectedJSON = _ref2.expectedJSON, TEMP_TEST_DIR = _ref2.TEMP_TEST_DIR, read = _ref2.read;

            file = resolve(TEMP_TEST_DIR, 'test.json');
            return Promise.resolve(writeJSON(file, expectedJSON)).then(function ($await_2) {
                try {
                    return Promise.resolve(read(file)).then(function ($await_3) {
                        try {
                            res = $await_3;
                            equal(res, '{"json":true,"test":"data","date":null}');
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
    'should use spaces'(_ref3) {
        return new Promise(function ($return, $error) {
            var expectedJSON, TEMP_TEST_DIR, read, file, res;
            expectedJSON = _ref3.expectedJSON, TEMP_TEST_DIR = _ref3.TEMP_TEST_DIR, read = _ref3.read;

            file = resolve(TEMP_TEST_DIR, 'test.json');
            return Promise.resolve(writeJSON(file, expectedJSON, { space: 2 })).then(function ($await_4) {
                try {
                    return Promise.resolve(read(file)).then(function ($await_5) {
                        try {
                            res = $await_5;
                            equal(res, expectedJSONWithSpaces);
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
    'should use a replacer function'(_ref4) {
        return new Promise(function ($return, $error) {
            var expectedJSON, TEMP_TEST_DIR, read, file, test, res;
            expectedJSON = _ref4.expectedJSON, TEMP_TEST_DIR = _ref4.TEMP_TEST_DIR, read = _ref4.read;

            file = resolve(TEMP_TEST_DIR, 'test.json');
            test = 5;
            return Promise.resolve(writeJSON(file, expectedJSON, { replacer() {
                    return test;
                } })).then(function ($await_6) {
                try {
                    return Promise.resolve(read(file)).then(function ($await_7) {
                        try {
                            res = $await_7;
                            equal(res, test);
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

module.exports = readJSONTestSuite;