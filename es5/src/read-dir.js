'use strict';

var fs = require('fs');
var makePromise = require('makepromise');
var path = require('path');
var read = require('./read');

function lstatFiles(dirPath, dirContent) {
    var readFiles = dirContent.map(function (fileOrDir) {
        var newPath = path.join(dirPath, fileOrDir);
        return makePromise(fs.lstat, newPath).then(function (lstat) {
            return {
                lstat,
                path: newPath,
                relativePath: fileOrDir
            };
        });
    });
    return Promise.all(readFiles);
}

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
    return files.filter(function (file) {
        return recursive ? fileOrDir(file.lstat) : file.lstat.isFile();
    });
}

/**
 * Read a directory, and return contents of contained files.
 * @param {string} dirPath Path to the directory
 * @param {boolean} [recursive=false] Whether to read found folders as well
 * @returns {Promise<object>} An object reflecting directory structure, e.g.,
 * { dir: subdir: { 'fileA.txt': 'foo', 'fileB.js': 'bar' }, 'fileC.jpg': 'baz' }
 */
function readDir(dirPath, recursive) {
    return makePromise(fs.readdir, [dirPath]).then(function (res) {
        return lstatFiles(dirPath, res);
    }).then(function (lstatRes) {
        var filteredFiles = filterFiles(lstatRes, recursive);
        var promises = filteredFiles.map(function (file) {
            var promise = void 0;
            if (file.lstat.isDirectory()) {
                promise = readDir(file.path, recursive);
            } else if (file.lstat.isFile()) {
                promise = read(file.path);
            }
            return promise.then(function (res) {
                return { file: file.relativePath, data: res };
            });
        });
        return Promise.all(promises);
    }).then(function (res) {
        return res.reduce(function (acc, current) {
            return Object.assign({}, acc, { [current.file]: current.data });
        }, {});
    });
}

module.exports = readDir;