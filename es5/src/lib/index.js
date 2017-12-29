var _require = require('path'),
    join = _require.join,
    resolve = _require.resolve;

var fs = require('fs');
var makePromise = require('makepromise/es5/src/');

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
    return new Promise(function ($return, $error) {
        var readFiles = dirContent.map(function (relativePath) {
            return new Promise(function ($return, $error) {
                var path, lstat;

                path = resolve(dirPath, relativePath);
                return Promise.resolve(makePromise(fs.lstat, path)).then(function ($await_1) {
                    try {
                        lstat = $await_1;
                        return $return({
                            lstat,
                            path,
                            relativePath
                        });
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }.bind(this), $error);
            }.bind(this));
        });
        return $return(Promise.all(readFiles));
    }.bind(this));
}

function flattenStructure(structure, includeDirs) {
    var dirNames = Object.keys(structure);
    var res = dirNames.reduce(function (acc, key) {
        var item = structure[key];
        var innerFlatten = flattenArray(item, includeDirs).map(function (i) {
            return join(key, i);
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