var assert = require('assert');

var _require = require('assert-diff'),
    deepEqual = _require.deepEqual;

var clone = require('../../src/clone');
var WroteContext = require('../context/WroteContext');

var equal = assert.equal;


var cloneTestSuite = {
    context: WroteContext,
    'should clone a directory'(_ref) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, TEMP_TEST_DIR, readFixturesStructure, readTempStructure, readTemp, readFixtures, expected, actual, expectedRead, actualRead;
            FIXTURES_TEST_DIR = _ref.FIXTURES_TEST_DIR, TEMP_TEST_DIR = _ref.TEMP_TEST_DIR, readFixturesStructure = _ref.readFixturesStructure, readTempStructure = _ref.readTempStructure, readTemp = _ref.readTemp, readFixtures = _ref.readFixtures;
            return Promise.resolve(clone({
                to: TEMP_TEST_DIR,
                from: FIXTURES_TEST_DIR
            })).then(function ($await_2) {
                try {
                    return Promise.resolve(readFixturesStructure()).then(function ($await_3) {
                        try {

                            expected = $await_3;
                            return Promise.resolve(readTempStructure()).then(function ($await_4) {
                                try {
                                    actual = $await_4;
                                    deepEqual(actual, expected);

                                    return Promise.resolve(readFixtures()).then(function ($await_5) {
                                        try {
                                            expectedRead = $await_5;
                                            return Promise.resolve(readTemp()).then(function ($await_6) {
                                                try {
                                                    actualRead = $await_6;
                                                    deepEqual(actualRead, expectedRead);
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
    'should use regular expressions'(_ref2) {
        return new Promise(function ($return, $error) {
            var FIXTURES_TEST_DIR, TEMP_TEST_DIR, readFixtures, readTemp, expected, actual;
            FIXTURES_TEST_DIR = _ref2.FIXTURES_TEST_DIR, TEMP_TEST_DIR = _ref2.TEMP_TEST_DIR, readFixtures = _ref2.readFixtures, readTemp = _ref2.readTemp;
            return Promise.resolve(clone({
                to: TEMP_TEST_DIR,
                from: FIXTURES_TEST_DIR,
                regexes: [{
                    re: /sys\.stderr\.write('test-file')/,
                    // eslint-disable-next-line quotes
                    replacement: "sys.stdout.write('updated-test-file')"
                }, {
                    re: /file/g,
                    replacement: 'UFO'
                }]
            })).then(function ($await_7) {
                try {
                    return Promise.resolve(readFixtures()).then(function ($await_8) {
                        try {

                            expected = $await_8;
                            expected.subdirectory['file.data'] = 'this is a UFO with some data\n';
                            expected.subdirectory['file2.data'] = 'this is another UFO with some other data\n';
                            expected.subdirectory2['file3.data'] = 'a UFO in another subdirectory\n';
                            expected.subdirectory2.subsubdir['file4.py'] = 'sys.stderr.write(\'test-UFO\')\n';

                            return Promise.resolve(readTemp()).then(function ($await_9) {
                                try {
                                    actual = $await_9;
                                    deepEqual(actual, expected);
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
    },
    'should throw'() {
        return new Promise(function ($return, $error) {
            var stack, code;
            var $Try_1_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_1_Catch = function (_ref3) {
                try {
                    stack = _ref3.stack;
                    code = _ref3.code;

                    equal(code, 'ENOENT');
                    assert(/should throw/.test(stack));
                    return $Try_1_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                Error.stackTraceLimit = Infinity;
                return Promise.resolve(clone({
                    regexes: [{
                        re: /test/,
                        replacement: 'test'
                    }],
                    to: 'local-dir',
                    from: 'local-path-does-not-exist'
                })).then(function ($await_10) {
                    try {
                        throw new Error('should have thrown');
                    } catch ($boundEx) {
                        return $Try_1_Catch($boundEx);
                    }
                }.bind(this), $Try_1_Catch);
            } catch (_ref3) {
                $Try_1_Catch(_ref3)
            }
        }.bind(this));
    }
};

module.exports = cloneTestSuite;