var _require = require('stream'),
    Readable = _require.Readable,
    Writable = _require.Writable;

var _require2 = require('zoroaster/assert'),
    throws = _require2.throws;

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
            return Promise.resolve(write(ws, testString)).then(function ($await_1) {
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
                read() {
                    this.push(testString);
                    this.push(null);
                }
            });
            return Promise.resolve(write(ws, rs)).then(function ($await_2) {
                try {
                    resWs = $await_2;
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
            var testString, _createWs3, ws, rs, catchment;

            testString = 'hello world';
            _createWs3 = createWs(), ws = _createWs3.ws;

            rs = new Readable({
                read() {
                    this.push(testString);
                    this.push(null);
                }
            });
            catchment = new Catchment();
            rs.pipe(catchment);
            return Promise.resolve(catchment.promise).then(function ($await_3) {
                try {
                    return Promise.resolve(throws({
                        fn: write,
                        args: [ws, rs],
                        message: 'Stream is not readable'
                    })).then(function ($await_4) {
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
            return Promise.resolve(throws({
                fn: write,
                args: [ws, rs],
                error
            })).then(function ($await_5) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should reject when writable throws'() {
        return new Promise(function ($return, $error) {
            var testString, error, _createWs5, ws, rs;

            testString = 'hello world';
            error = new Error('test-error');
            _createWs5 = createWs(error), ws = _createWs5.ws;

            rs = new Readable({
                read() {
                    rs.push(testString);
                    rs.push(null);
                }
            });
            return Promise.resolve(throws({
                fn: write,
                args: [ws, rs],
                error
            })).then(function ($await_6) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    },
    'should write nothing when null given'() {
        return new Promise(function ($return, $error) {
            var _createWs6, ws, allData;

            _createWs6 = createWs(), ws = _createWs6.ws, allData = _createWs6.allData;
            return Promise.resolve(write(ws, null)).then(function ($await_7) {
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
            return Promise.resolve(write(ws, buffer)).then(function ($await_8) {
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
            return Promise.resolve(throws({
                fn: write,
                args: ['string'],
                message: 'Writable stream expected'
            })).then(function ($await_9) {
                try {
                    return $return();
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }.bind(this));
    }
};

module.exports = writeTestSuite;