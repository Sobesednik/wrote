var _require = require('fs'),
    createWriteStream = _require.createWriteStream;

var _require2 = require('path'),
    resolve = _require2.resolve;

var _require3 = require('os'),
    tmpdir = _require3.tmpdir;

function openFileForWrite(path) {
    return new Promise(function ($return, $error) {
        var writable;
        return Promise.resolve(new Promise(function (resolve, reject) {
            var ws = createWriteStream(path, {
                flags: 'w',
                defaultEncoding: 'utf8',
                fd: null,
                mode: 0o666,
                autoClose: true
            });
            ws.once('open', function () {
                return resolve(ws);
            });
            ws.once('error', reject);
        })).then(function ($await_1) {
            try {
                writable = $await_1;
                return $return(writable);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

function getTempFile() {
    var rnd = Math.ceil(Math.random() * 100000);
    var tempFile = resolve(tmpdir(), `wrote-${rnd}.data`);
    return tempFile;
}

/**
 * Open the file for writing and create a write stream.
 * @param {string} ffile path to the file
 * @returns {Promise<Writable>} A promise with the stream
 */
function wrote() {
    var $args = arguments;return new Promise(function ($return, $error) {
        var file, ws;
        file = $args.length > 0 && $args[0] !== undefined ? $args[0] : getTempFile();
        return Promise.resolve(openFileForWrite(file)).then(function ($await_2) {
            try {
                ws = $await_2;
                return $return(ws);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = wrote;