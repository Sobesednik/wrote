const fs = require('fs')
const makePromise = require('makepromise')
const { dirname } = require('path')

/**
 * Make sure that a file can be created by making all directories to which it belongs
 * @param {string} path Path to the file
 * @resolves {path} Resolves with given filepath
 * @rejects {Error} Rejects when a first folder in the path is non-executable
 */
async function ensurePath(path) {
    const dir = dirname(path)
    try {
        await make(dir)
        return path
    } catch (err) {
        if (/EEXIST/.test(err.message) && err.message.indexOf(dir) != -1) {
            return path
        }
        throw err
    }
}

/**
 * Recursive promise-based mkdir.
 * @param {string} dir Path to the directory to be created
 */
async function make(dir) {
    try {
        const res = await makeDir(dir)
        return res
    } catch (err) {
        if (/ENOENT/.test(err.message)) {
            const parentDir = dirname(dir)
            await make(parentDir)
            const res2 = await make(dir)
            return res2
        }
        throw err
    }
}

/**
 * Promisified fs.mkdir
 * @param {string} dir directory name
 * @returns {string} created directory name
 */
async function makeDir(dir) {
    const res = await makePromise(fs.mkdir, dir, dir)
    return res
}

module.exports = ensurePath
