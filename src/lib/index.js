const path = require('path')
const fs = require('fs')
const makePromise = require('makepromise')

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
 * @returns {File} A file object.
 */
function lstatFiles(dirPath, dirContent) {
    const readFiles = dirContent.map((item) => {
        const fullPath = path.join(dirPath, item)
        return makePromise(fs.lstat, fullPath)
            .then((lstat) => {
                return {
                    lstat,
                    path: fullPath,
                    relativePath: item,
                }
            })
    })
    return Promise.all(readFiles)
}

function flattenStructure(structure, includeDirs) {
    const dirNames = Object.keys(structure)
    const res = dirNames.reduce((acc, key) => {
        const item = structure[key]
        const innerFlatten = flattenArray(item, includeDirs)
            .map(i => path.join(key, i))
        return [].concat(acc, innerFlatten)
    }, [])
    return includeDirs ? [].concat(res, dirNames) : res
}

function flattenArray(array, includeDirs) {
    return array.reduce((acc, current) => {
        if (typeof current === 'string') {
            return [].concat(acc, current)
        }
        const res = flattenStructure(current, includeDirs)
        return [].concat(acc, res)
    }, [])
}

function checkArray(array) {
    if (!Array.isArray(array)) {
        throw new Error('Please pass an array')
    }
}
function flatten(array) {
    checkArray(array)
    return flattenArray(array)
}

function flattenAll(array) {
    checkArray(array)
    return flattenArray(array, true)
}

module.exports = {
    lstatFiles,
    flattenAll,
    flatten,
}
