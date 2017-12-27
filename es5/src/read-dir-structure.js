var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var fs = require('fs');
var makePromise = require('makepromise');
var lib = require('./lib/');

/**
 * A directory structure representation
 * { dir: subdir: { 'fileA.txt': 'foo', 'fileB.js': 'bar' }, 'fileC.jpg': 'baz' }
 * @typedef {Object} LstatRes
 * @property {fs.Stats} lstat
 * @property {string} relativePath
 */

/**
 * Check if lstat result is a directory
 * @param {LstatRes} lstatRes Result of lib.lstatFiles
 * @returns
 */
var isDirectory = function isDirectory(lstatRes) {
    return lstatRes.lstat.isDirectory();
};
/**
 * Check if lstat result is not a directory
 * @param {LstatRes} lstatRes Result of lib.lstatFiles
 * @returns
 */
var isNotDirectory = function isNotDirectory(lstatRes) {
    return !lstatRes.lstat.isDirectory();
};

/**
 * A directory structure representation
 * { type: "Directory", content: { "data.txt": { type: "File" } }
 * @typedef {Object} DirectoryStructure
 * @property {string} type File type, e.g., Directory, File, Symlink
 * @property {Object.<string, DirectoryStructure>} [content] Content if directory.
 */

var getType = function getType(lstatRes) {
    if (lstatRes.lstat.isDirectory()) {
        return 'Directory';
    }
    if (lstatRes.lstat.isFile()) {
        return 'File';
    }
    if (lstatRes.lstat.isSymbolicLink()) {
        return 'SymbolicLink';
    }
};
/**
 * Read a directory, and return its structure as an object
 * @param {string} dirPath Path to the directory
 * @returns {Promise.<DirectoryStructure>} An object reflecting directory structure
 */
function readDirStructure(dirPath) {
    return new Promise(function ($return, $error) {
        var lstat, err, dir, lstatRes, directories, notDirectories, files, dirPromises, dirsArray, dirs, merged;

        if (!dirPath) {
            return $error(new Error('Please specify a path to the directory'));
        }
        return Promise.resolve(makePromise(fs.lstat, dirPath)).then(function ($await_3) {
            try {
                lstat = $await_3;
                if (!lstat.isDirectory()) {
                    err = new Error('Path is not a directory');
                    err.code = 'ENOTDIR';
                    return $error(err);
                }
                return Promise.resolve(makePromise(fs.readdir, dirPath)).then(function ($await_4) {
                    try {
                        dir = $await_4;
                        return Promise.resolve(lib.lstatFiles(dirPath, dir)).then(function ($await_5) {
                            try {
                                lstatRes = $await_5;

                                directories = lstatRes.filter(isDirectory);
                                notDirectories = lstatRes.filter(isNotDirectory);

                                files = notDirectories.reduce(function (acc, lstatRes) {
                                    return Object.assign(acc, {
                                        [lstatRes.relativePath]: {
                                            type: getType(lstatRes)
                                        }
                                    });
                                }, {});

                                dirPromises = directories.map(function (_ref) {
                                    return new Promise(function ($return, $error) {
                                        var path, relativePath, structure;
                                        path = _ref.path, relativePath = _ref.relativePath;
                                        return Promise.resolve(readDirStructure(path)).then(function ($await_6) {
                                            try {
                                                structure = $await_6;
                                                return $return([relativePath, structure]);
                                            } catch ($boundEx) {
                                                return $error($boundEx);
                                            }
                                        }.bind(this), $error);
                                    }.bind(this));
                                });
                                return Promise.resolve(Promise.all(dirPromises)).then(function ($await_7) {
                                    try {
                                        dirsArray = $await_7;
                                        dirs = dirsArray.reduce(function (acc, _ref2) {
                                            var _ref3 = _slicedToArray(_ref2, 2),
                                                relativePath = _ref3[0],
                                                structure = _ref3[1];

                                            var d = { [relativePath]: structure };
                                            return Object.assign(acc, d);
                                        }, {});
                                        merged = Object.assign({}, files, dirs);
                                        return $return({
                                            type: 'Directory',
                                            content: merged
                                        });
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
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = readDirStructure;