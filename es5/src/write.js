var Readable = require('stream').Readable;
var Writable = require('stream').Writable;
var makePromise = require('makepromise/es5/src/');

/**
 * Write data to the stream, and resolve when it's ended.
 * @param {Writable} ws write stream
 * @param {string|Readable} source read source
 * @returns {Promise<Writable>} A promise resolved with the writable stream, or rejected
 * when an error occurred while reading or writing.
 */
function write(ws, source) {
    return new Promise(function ($return, $error) {
        if (!(ws instanceof Writable)) {
            return $error(new Error('Writable stream expected'));
        }
        if (source instanceof Readable) {
            if (!source.readable) {
                return $error(new Error('Stream is not readable'));
            }
            return Promise.resolve(new Promise(function (resolve, reject) {
                ws.on('finish', resolve);
                ws.on('error', reject);
                source.on('error', reject);
                source.pipe(ws);
            })).then(function ($await_2) {
                try {
                    return $return(ws);
                } catch ($boundEx) {
                    return $error($boundEx);
                }
            }.bind(this), $error);
        }
        return Promise.resolve(makePromise(ws.end.bind(ws), source)).then(function ($await_3) {
            try {
                return $return(ws);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = write;