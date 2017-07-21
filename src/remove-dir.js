const assert = require('assert')
const fs = require('fs')
const path = require('path')
const makePromise = require('makepromise')
const debuglog = require('util').debuglog('wrote')
const readDirStructure = require('./read-dir-structure')

function unlinkFile(filePath) {
    debuglog('unlink %s', filePath)
    return makePromise(fs.unlink, filePath, filePath)
}

function unlinkDir(dirPath) {
    debuglog('rmdir %s', dirPath)
    return makePromise(fs.rmdir, dirPath, dirPath)
}

// function unlinkKeysInStructure(parentPath, structure) {
    // const keys = Object.keys(structure)
    // return Promise.all(folders.map((key) => {
        // return unlinkDir(path.join(dirPath, key))
    // }))
// }

function flatten(res) {
    return res.reduce((acc, current) => {
        return [].concat(acc, current)
    }, [])
}

function unlinkStructure(parentPath, structure) {
    const keys = Object.keys(structure)
    const unlinkInner = keys.map((key) => {
        const value = structure[key]
        return unlinkArray(path.join(parentPath, key), value)
    })
    return Promise.all(unlinkInner)
        .then(flatten)
}

function unlinkArray(dirPath, dirContent) {
    assert.equal(typeof dirPath, 'string', 'directory path name must be a string')
    assert(Array.isArray(dirContent), 'content must be an array')

    const toUnlink = dirContent.map((item) => {
        if (typeof item === 'string') {
            const filePath = path.join(dirPath, item)
            return unlinkFile(filePath)
        } else if (typeof item === 'object') {
            return unlinkStructure(dirPath, item)
        }
    })
    return Promise.all(toUnlink)
        .then(flatten)
        .then((res) => {
            return unlinkDir(dirPath)
                .then((res2) => {
                    return [].concat(res, res2)
                })
        })
}

/**
 * Delete directory completely
 * @param {string} dirPath path to the directory to remove
 * @returns {Promise<string>} A promise resolved with the path to the removed dir
 */
function removeDir(dirPath) {
    if (!dirPath) {
        return Promise.reject(new Error('Please give path to directory'))
    }
    return readDirStructure(dirPath)
        .then((res) => {
            return unlinkArray(dirPath, res)
            // return Promise.all(res.map((item) => {
            //     if (typeof item === 'string') {
            //         // unlink
            //     }
            //     return
            // }))
            // console.log(res[2].subdirectory2)
        })
}

module.exports = removeDir
