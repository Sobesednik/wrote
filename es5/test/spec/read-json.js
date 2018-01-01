var _require = require('zoroaster/assert'),
    deepEqual = _require.deepEqual,
    throws = _require.throws;

var context = require('../context/WroteContext');
var readJSON = require('../../src/read-json');

var readJSONTestSuite = {
    context,
    'should read a JSON file'(_ref) {
        return new Promise(function ($return, $error) {
            var expectedJSON, JSONpath, res;
            expectedJSON = _ref.expectedJSON, JSONpath = _ref.JSONpath;
            return Promise.resolve(readJSON(JSONpath)).then(function ($await_1) {
                try {
                    res = $await_1;
                    deepEqual(res, expectedJSON);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should throw an error if file is not found'(_ref2) {
        return new Promise(function ($return, $error) {
            var tempFile;
            tempFile = _ref2.tempFile;
            return Promise.resolve(throws({
                fn: readJSON,
                args: [tempFile],
                code: 'ENOENT'
            })).then(function ($await_2) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should throw an error if cannot parse JSON'(_ref3) {
        return new Promise(function ($return, $error) {
            var invalidJSONpath;
            invalidJSONpath = _ref3.invalidJSONpath;
            return Promise.resolve(throws({
                fn: readJSON,
                args: [invalidJSONpath],
                message: 'Unexpected token h in JSON at position 1'
            })).then(function ($await_3) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = readJSONTestSuite;