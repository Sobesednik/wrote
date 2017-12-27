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
    if (!dirPath) {
        return Promise.reject(new Error('Please specify a path to the directory'));
    }
    return makePromise(fs.lstat, dirPath).then(function (res) {
        if (!res.isDirectory()) {
            var err = new Error('Path is not a directory');
            err.code = 'ENOTDIR';
            throw err;
        }
        return makePromise(fs.readdir, dirPath);
    }).then(function (res) {
        return lib.lstatFiles(dirPath, res);
    }).then(function (lstatRes) {
        var directories = lstatRes.filter(isDirectory);
        var notDirectories = lstatRes.filter(isNotDirectory);
        var files = notDirectories.reduce(function (acc, lstatRes) {
            return Object.assign(acc, {
                [lstatRes.relativePath]: {
                    type: getType(lstatRes)
                }
            });
        }, {});
        // return files
        return Promise.all(directories.map(function (dir) {
            return readDirStructure(dir.path).then(function (res) {
                return {
                    [dir.relativePath]: res
                };
            });
        })).then(function (allDirs) {
            if (!allDirs.length) return {};
            return allDirs.reduce(function (acc, current) {
                return Object.assign(acc, current);
            }, {});
        }).then(function (dirs) {
            return Object.assign({}, files, dirs);
        });
    }).then(function (res) {
        return {
            type: 'Directory',
            content: res
            // return [].concat(notDirs, res)
        };
    });
}

module.exports = readDirStructure;