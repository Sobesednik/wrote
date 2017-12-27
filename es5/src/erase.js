var makePromise = require('makepromise');
var fs = require('fs');

function unlink(path) {
    var promise = makePromise(fs.unlink, path, path);
    return promise;
}

function endStream(ws) {
    if (!ws.writable || ws.closed) {
        return Promise.reject(new Error('stream should be writable'));
    }
    var promise = new Promise(function (resolve, reject) {
        ws.once('close', function () {
            return resolve(ws);
        });
        ws.once('error', reject);
    });
    return makePromise(ws.close.bind(ws)).then(function () {
        return promise;
    });
}

/**
 * Unlink a file based on its WriteStream.
 * @param {Writable} ws Writable of a file
 * @returns {Promise<Writable>} Promise resolved with the stream.
 */
function erase(ws) {
    return unlink(ws.path).then(function () {
        if (!ws.closed) {
            return endStream(ws);
        }
        return ws;
    });
}

module.exports = erase;