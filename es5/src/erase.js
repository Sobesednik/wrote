var makePromise = require('makepromise');
var fs = require('fs');

function unlink(path) {
    return new Promise(function ($return, $error) {
        return Promise.resolve(makePromise(fs.unlink, path)).then(function ($await_2) {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

function endStream(ws) {
    return new Promise(function ($return, $error) {
        var promise;

        if (!ws.writable || ws.closed) {
            return $error(new Error('stream should be writable'));
        }
        promise = new Promise(function (resolve, reject) {
            ws.once('close', resolve);
            ws.once('error', reject);
        });
        return Promise.resolve(makePromise(ws.close.bind(ws))).then(function ($await_3) {
            try {
                return Promise.resolve(promise).then(function ($await_4) {
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
}

/**
 * Unlink a file based on its WriteStream and close the underlying stream.
 * @param {Writable} ws Writable of a file
 * @returns {Promise.<Writable>} Closed writable stream
 */
function erase(ws) {
    return new Promise(function ($return, $error) {
        return Promise.resolve(unlink(ws.path)).then(function ($await_5) {
            try {
                if (ws.writable) {
                    return Promise.resolve(endStream(ws)).then(function ($await_6) {
                        try {
                            return $If_1.call(this);
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this), $error);
                }

                function $If_1() {
                    return $return(ws);
                }

                return $If_1.call(this);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = erase;