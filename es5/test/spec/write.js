var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
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
    'should write a string to the stream': function shouldWriteAStringToTheStream() {
        var testString = 'hello world';
        var ws = createWs();
        return write(ws.ws, testString).then(function () {
            assert.deepEqual(ws.allData, [testString]);
            assert(!ws.writable);
        });
    },
    'should pipe a readable to the stream': function shouldPipeAReadableToTheStream() {
        var testString = 'hello world';
        var ws = createWs();
        var rs = new Readable({
            read: function read() {
                rs.push(testString);
                rs.push(null);
            }
        });
        return write(ws.ws, rs).then(function (res) {
            assert.deepEqual(ws.allData, [testString]);
            assert(res._writableState.ended);
            assert.strictEqual(res, ws.ws);
        });
    },
    'should reject when reabable is not readable': function shouldRejectWhenReabableIsNotReadable() {
        var testString = 'hello world';
        var ws = createWs();
        var rs = new Readable({
            read: function read() {
                rs.push(testString);
                rs.push(null);
            }
        });
        var catchment = new Catchment();
        rs.pipe(catchment);
        return catchment.promise.then(function () {
            return write(ws.ws, rs);
        }).then(function () {
            throw new Error('Should have been rejected');
        }, function (err) {
            if (!/Stream is not readable/.test(err.message)) {
                throw err;
            }
        });
    },
    'should reject with an error when readable throws': function shouldRejectWithAnErrorWhenReadableThrows() {
        var ws = createWs();
        var error = new Error('test-error');
        var rs = new Readable({
            read() {
                var _this = this;

                process.nextTick(function () {
                    return _this.emit('error', error);
                });
                return;
            }
        });
        return write(ws.ws, rs).then(function () {
            throw new Error('Should have been rejected');
        }, function (err) {
            assert.strictEqual(err, error);
        });
    },
    'should reject when writable throws': function shouldRejectWhenWritableThrows() {
        var testString = 'hello world';
        var error = new Error('test-error');
        var ws = createWs(error);
        var rs = new Readable({
            read: function read() {
                rs.push(testString);
                rs.push(null);
            }
        });
        return write(ws.ws, rs).then(function () {
            throw new Error('Should have been rejected');
        }, function (err) {
            assert.strictEqual(err, error);
        });
    },
    'should write nothing when null given': function shouldWriteNothingWhenNullGiven() {
        var ws = createWs();
        return write(ws.ws, null).then(function () {
            assert.deepEqual(ws.allData, []);
            assert(!ws.writable);
        });
    },
    'should write buffer': function shouldWriteBuffer() {
        var testString = 'hello world';
        var buffer = Buffer.from(testString);
        var ws = createWs();
        return write(ws.ws, buffer).then(function () {
            assert.deepEqual(ws.allRawData, [buffer]);
            assert(!ws.writable);
        });
    },
    'should reject if writable is not Writable': function shouldRejectIfWritableIsNotWritable() {
        return write('string').then(function () {
            throw new Error('Should have been rejected');
        }, function (err) {
            if (!/Writable stream expected/.test(err.message)) {
                throw err;
            }
        });
    }
};

module.exports = writeTestSuite;