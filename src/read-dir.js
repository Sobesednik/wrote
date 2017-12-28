const fs = require('fs')
const makePromise = require('makepromise')
const read = require('./read')
const { lstatFiles } = require('./lib/')

/**
 * Filter lstat results, taking only files if recursive is false.
 * @param {lstat[]} files An array with lstat results
 * @param {boolean} [recursive = false] Whether recursive mode is on
 * @returns {lstat[]} Filtered array.
 */
function filterFiles(files, recursive) {
    const fileOrDir = (lstat) => {
        return lstat.isFile() || lstat.isDirectory()
    }
    return files.filter(({ lstat }) => {
        return recursive ? fileOrDir(lstat) : lstat.isFile()
    })
}

/**
 * Read a directory, and return contents of contained files.
 * @param {string} dirPath Path to the directory
 * @param {boolean} [recursive=false] Whether to read found folders as well
 * @returns {Promise<object>} An object reflecting directory structure, e.g.,
 * { dir: subdir: { 'fileA.txt': 'foo', 'fileB.js': 'bar' }, 'fileC.jpg': 'baz' }
 */
async function readDir(dirPath, recursive = false) {
    const contents = await makePromise(fs.readdir, [dirPath])
    const lstatRes = await lstatFiles(dirPath, contents)
    const filteredFiles = filterFiles(lstatRes, recursive)

    const promises = filteredFiles.map(async ({ lstat, path, relativePath }) => {
        let promise = Promise.resolve()
        if (lstat.isDirectory()) {
            promise = readDir(path, recursive)
        } else if (lstat.isFile()) {
            promise = read(path)
        }
        const data = await promise
        return { relativePath, data }
    })
    const allRead = await Promise.all(promises)
    const res = allRead.reduce(
        (acc, { data, relativePath }) => {
            const d = {
                [relativePath]: data,
            }
            return Object.assign(acc, d)
        }, {}
    )
    return res
}

module.exports = readDir
