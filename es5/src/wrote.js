var fs = require('fs');
var os = require('os');
var path = require('path');
var TEMP_DIR = os.tmpdir();

function openFileForWrite(filepath) {
    return new Promise(function (resolve, reject) {
        var ws = fs.createWriteStream(filepath, {
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
    });
}

function getTempFile() {
    var rnd = Math.ceil(Math.random() * 100000);
    var tempFile = path.join(TEMP_DIR, `wrote-${rnd}.data`);
    return tempFile;
}

/**
 * Open the file for writing and create a write stream.
 * @param {string} ffile path to the file
 * @returns {Promise<Writable>} A promise with the stream
 */
function wrote(file) {
    var _file = (typeof file).toLowerCase() === 'string' ? file : getTempFile();
    return openFileForWrite(_file);
}

module.exports = wrote;