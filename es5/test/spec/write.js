var _require = require('stream'),
    Readable = _require.Readable,
    Writable = _require.Writable;

var assert = require('assert');
var Catchment = require('catchment');
var write = require('../../src/write');

function createWs(nextArg) {
    var allData = [];
    var allRawData = [];
    var ws = new Writable({
        write: function write(chunk, encoding, next) {
            allData.push(String(chunk));
            allRawData.push(chunk);
            next(nextArg);
        }
    });
    return { ws, allData, allRawData };
}

var writeTestSuite = {
    'should write a string to the stream'() {
        return new Promise(function ($return, $error) {
            var testString, _createWs, ws, allData;

            testString = 'hello world';
            _createWs = createWs(), ws = _createWs.ws, allData = _createWs.allData;
            return Promise.resolve(write(ws, testString)).then(function ($await_5) {
                try {
                    assert.deepEqual(allData, [testString]);
                    assert(ws._writableState.ended);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should pipe a readable to the stream'() {
        return new Promise(function ($return, $error) {
            var testString, _createWs2, ws, allData, rs, resWs;

            testString = 'hello world';
            _createWs2 = createWs(), ws = _createWs2.ws, allData = _createWs2.allData;

            rs = new Readable({
                read: function read() {
                    rs.push(testString);
                    rs.push(null);
                }
            });
            return Promise.resolve(write(ws, rs)).then(function ($await_6) {
                try {
                    resWs = $await_6;
                    assert.strictEqual(resWs, ws);
                    assert.deepEqual(allData, [testString]);
                    assert(ws._writableState.ended);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should reject when reabable is not readable'() {
        return new Promise(function ($return, $error) {
            var testString, _createWs3, ws, rs, catchment, message;

            testString = 'hello world';
            _createWs3 = createWs(), ws = _createWs3.ws;

            rs = new Readable({
                read: function read() {
                    rs.push(testString);
                    rs.push(null);
                }
            });
            catchment = new Catchment();
            rs.pipe(catchment);
            return Promise.resolve(catchment.promise).then(function ($await_7) {
                try {
                    var $Try_1_Post = function () {
                        try {
                            return $return();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);var $Try_1_Catch = function (_ref) {
                        try {
                            message = _ref.message;

                            assert(/Stream is not readable/.test(message));
                            return $Try_1_Post();
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this);
                    try {
                        return Promise.resolve(write(ws, rs)).then(function ($await_8) {
                            try {
                                throw new Error('Should have been rejected');
                            } catch ($boundEx) {
                                return $Try_1_Catch($boundEx);
                            }
                        }.bind(this), $Try_1_Catch);
                    } catch (_ref) {
                        $Try_1_Catch(_ref)
                    }
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should reject when readable throws'() {
        return new Promise(function ($return, $error) {
            var _createWs4, ws, error, rs;

            _createWs4 = createWs(), ws = _createWs4.ws;

            error = new Error('test-error');
            rs = new Readable({
                read() {
                    var _this = this;

                    process.nextTick(function () {
                        return _this.emit('error', error);
                    });
                }
            });
            var $Try_2_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_2_Catch = function (err) {
                try {
                    assert.strictEqual(err, error);
                    return $Try_2_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);try {
                return Promise.resolve(write(ws, rs)).then(function ($await_9) {
                    try {
                        throw new Error('Should have been rejected');
                    } catch ($boundEx) {
                        return $Try_2_Catch($boundEx);
                    }
                }.bind(this), $Try_2_Catch);
            } catch (err) {
                $Try_2_Catch(err)
            }
        }.bind(this));
    },
    'should reject when writable throws'() {
        return new Promise(function ($return, $error) {
            var testString, error, _createWs5, ws, rs;

            testString = 'hello world';
            error = new Error('test-error');
            _createWs5 = createWs(error), ws = _createWs5.ws;

            rs = new Readable({
                read: function read() {
                    rs.push(testString);
                    rs.push(null);
                }
            });
            var $Try_3_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_3_Catch = function (err) {
                try {
                    assert.strictEqual(err, error);
                    return $Try_3_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);try {
                return Promise.resolve(write(ws, rs)).then(function ($await_10) {
                    try {
                        throw new Error('Should have been rejected');
                    } catch ($boundEx) {
                        return $Try_3_Catch($boundEx);
                    }
                }.bind(this), $Try_3_Catch);
            } catch (err) {
                $Try_3_Catch(err)
            }
        }.bind(this));
    },
    'should write nothing when null given'() {
        return new Promise(function ($return, $error) {
            var _createWs6, ws, allData;

            _createWs6 = createWs(), ws = _createWs6.ws, allData = _createWs6.allData;
            return Promise.resolve(write(ws, null)).then(function ($await_11) {
                try {
                    assert.deepEqual(allData, []);
                    assert(ws._writableState.ended);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should write buffer'() {
        return new Promise(function ($return, $error) {
            var testString, buffer, _createWs7, ws, allRawData;

            testString = 'hello world';
            buffer = Buffer.from(testString);
            _createWs7 = createWs(), ws = _createWs7.ws, allRawData = _createWs7.allRawData;
            return Promise.resolve(write(ws, buffer)).then(function ($await_12) {
                try {
                    assert.deepEqual(allRawData, [buffer]);
                    assert(ws._writableState.ended);
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should reject if writable is not Writable'() {
        return new Promise(function ($return, $error) {
            var message;
            var $Try_4_Post = function () {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);var $Try_4_Catch = function (_ref2) {
                try {
                    message = _ref2.message;

                    assert(/Writable stream expected/.test(message));
                    return $Try_4_Post();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this);
            try {
                return Promise.resolve(write('string')).then(function ($await_13) {
                    try {
                        throw new Error('Should have been rejected');
                    } catch ($boundEx) {
                        return $Try_4_Catch($boundEx);
                    }
                }.bind(this), $Try_4_Catch);
            } catch (_ref2) {
                $Try_4_Catch(_ref2)
            }
        }.bind(this));
    }
};

module.exports = writeTestSuite;