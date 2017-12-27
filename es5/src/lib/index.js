var path = require('path');
var fs = require('fs');
var makePromise = require('makepromise');

/**
 * A file representation
 * @typedef File
 * @property {fs.Stats} lstat result of lstat
 * @property {string} path full path to the file
 * @property {string} relativePath path inside of directory
 */

/**
 * Update information about directory's content with lstat.
 * @param {string} dirPath Path to the root directory
 * @param {string[]} dirContent
 * @returns {File[]} An array with file objects.
 */
function lstatFiles(dirPath, dirContent) {
    var readFiles = dirContent.map(function (item) {
        var fullPath = path.join(dirPath, item);
        return makePromise(fs.lstat, fullPath).then(function (lstat) {
            return {
                lstat,
                path: fullPath,
                relativePath: item
            };
        });
    });
    return Promise.all(readFiles);
}

function flattenStructure(structure, includeDirs) {
    var dirNames = Object.keys(structure);
    var res = dirNames.reduce(function (acc, key) {
        var item = structure[key];
        var innerFlatten = flattenArray(item, includeDirs).map(function (i) {
            return path.join(key, i);
        });
        return [].concat(acc, innerFlatten);
    }, []);
    return includeDirs ? [].concat(res, dirNames) : res;
}

function flattenArray(array, includeDirs) {
    return array.reduce(function (acc, current) {
        if (typeof current === 'string') {
            return [].concat(acc, current);
        }
        var res = flattenStructure(current, includeDirs);
        return [].concat(acc, res);
    }, []);
}

function checkArray(array) {
    if (!Array.isArray(array)) {
        throw new Error('Please pass an array');
    }
}
function flatten(array) {
    checkArray(array);
    return flattenArray(array);
}

function flattenAll(array) {
    checkArray(array);
    return flattenArray(array, true);
}

module.exports = {
    lstatFiles,
    flattenAll,
    flatten
};