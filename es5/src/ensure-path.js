var fs = require('fs');
var makePromise = require('makepromise');
var path = require('path');

/**
 * Make sure that a file can be created by making all directories to which it belongs
 * @param {string} filePath Path to the file
 * @resolves {filePath} Resolves with given filepath
 * @rejects {Error} Rejects when a first folder in the path is non-executable
 */
function ensurePath(filePath) {
    var dirname = path.dirname(filePath);
    return make(dirname).then(function () {
        return filePath;
    }).catch(function (err) {
        if (/EEXIST/.test(err.message) && err.message.indexOf(dirname) != -1) {
            return filePath;
        }
        throw err;
    });
}

/**
 * Recursive promise-based mkdir.
 * @param {string} dir Path to the directory to be created
 */
function make(dir) {
    return makeDir(dir).catch(function (err) {
        if (/ENOENT/.test(err.message)) {
            var parentDir = path.dirname(dir);
            return make(parentDir).then(function () {
                return make(dir);
            });
        }
        throw err;
    });
}

/**
 * Promisified fs.mkdir
 * @param {string} dir directory name
 * @resolves {string} created directory name
 */
function makeDir(dir) {
    return makePromise(fs.mkdir, dir, dir);
}

module.exports = ensurePath;