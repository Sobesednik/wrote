var fs = require('fs');
var makePromise = require('makepromise');
var read = require('./read');

var _require = require('./lib/'),
    lstatFiles = _require.lstatFiles;

/**
 * Filter lstat results, taking only files if recursive is false.
 * @param {lstat[]} files An array with lstat results
 * @param {boolean} [recursive = false] Whether recursive mode is on
 * @returns {lstat[]} Filtered array.
 */


function filterFiles(files, recursive) {
    var fileOrDir = function fileOrDir(lstat) {
        return lstat.isFile() || lstat.isDirectory();
    };
    return files.filter(function (_ref) {
        var lstat = _ref.lstat;

        return recursive ? fileOrDir(lstat) : lstat.isFile();
    });
}

/**
 * Read a directory, and return contents of contained files.
 * @param {string} dirPath Path to the directory
 * @param {boolean} [recursive=false] Whether to read found folders as well
 * @returns {Promise<object>} An object reflecting directory structure, e.g.,
 * { dir: subdir: { 'fileA.txt': 'foo', 'fileB.js': 'bar' }, 'fileC.jpg': 'baz' }
 */
function readDir(dirPath) {
    var $args = arguments;return new Promise(function ($return, $error) {
        var recursive, contents, lstatRes, filteredFiles, promises, allRead, res;
        recursive = $args.length > 1 && $args[1] !== undefined ? $args[1] : false;
        return Promise.resolve(makePromise(fs.readdir, [dirPath])).then(function ($await_1) {
            try {
                contents = $await_1;
                return Promise.resolve(lstatFiles(dirPath, contents)).then(function ($await_2) {
                    try {
                        lstatRes = $await_2;
                        filteredFiles = filterFiles(lstatRes, recursive);

                        promises = filteredFiles.map(function (_ref2) {
                            return new Promise(function ($return, $error) {
                                var lstat, path, relativePath, promise, data;
                                lstat = _ref2.lstat, path = _ref2.path, relativePath = _ref2.relativePath;

                                promise = Promise.resolve();
                                if (lstat.isDirectory()) {
                                    promise = readDir(path, recursive);
                                } else if (lstat.isFile()) {
                                    promise = read(path);
                                }
                                return Promise.resolve(promise).then(function ($await_3) {
                                    try {
                                        data = $await_3;
                                        return $return({ relativePath, data });
                                    } catch ($boundEx) {
                                        return $error($boundEx);
                                    }
                                }.bind(this), $error);
                            }.bind(this));
                        });
                        return Promise.resolve(Promise.all(promises)).then(function ($await_4) {
                            try {
                                allRead = $await_4;
                                res = allRead.reduce(function (acc, _ref3) {
                                    var data = _ref3.data,
                                        relativePath = _ref3.relativePath;

                                    var d = {
                                        [relativePath]: data
                                    };
                                    return Object.assign(acc, d);
                                }, {});
                                return $return(res);
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
}

module.exports = readDir;