const fs = require('fs')
const makePromise = require('makepromise')
const lib = require('./lib/')

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
const isDirectory = lstatRes => lstatRes.lstat.isDirectory()
/**
 * Check if lstat result is not a directory
 * @param {LstatRes} lstatRes Result of lib.lstatFiles
 * @returns
 */
const isNotDirectory = lstatRes => !lstatRes.lstat.isDirectory()

/**
 * A directory structure representation
 * { type: "Directory", content: { "data.txt": { type: "File" } }
 * @typedef {Object} DirectoryStructure
 * @property {string} type File type, e.g., Directory, File, Symlink
 * @property {Object.<string, DirectoryStructure>} [content] Content if directory.
 */

const getType = (lstatRes) => {
    if (lstatRes.lstat.isDirectory()) {
        return 'Directory'
    }
    if (lstatRes.lstat.isFile()) {
        return 'File'
    }
    if (lstatRes.lstat.isSymbolicLink()) {
        return 'SymbolicLink'
    }
}
/**
 * Read a directory, and return its structure as an object
 * @param {string} dirPath Path to the directory
 * @returns {Promise.<DirectoryStructure>} An object reflecting directory structure
 */
function readDirStructure(dirPath) {
    if (!dirPath) {
        return Promise.reject(new Error('Please specify a path to the directory'))
    }
    return makePromise(fs.lstat, dirPath)
        .then((res) => {
            if (!res.isDirectory()) {
                const err = new Error('Path is not a directory')
                err.code = 'ENOTDIR'
                throw err
            }
            return makePromise(fs.readdir, dirPath)
        })
        .then((res) => {
            return lib.lstatFiles(dirPath, res)
        })
        .then((lstatRes) => {
            const directories = lstatRes.filter(isDirectory)
            const notDirectories = lstatRes.filter(isNotDirectory)
            const files = notDirectories.reduce((acc, lstatRes) => Object.assign(acc, {
                [lstatRes.relativePath]: {
                    type: getType(lstatRes),
                },
            }), {})
            // return files
            return Promise.all(directories.map((dir) => {
                return readDirStructure(dir.path)
                    .then((res) => ({
                        [dir.relativePath]: res,
                    }))
            }))
                .then((allDirs) => {
                    if (!allDirs.length) return {}
                    return allDirs.reduce((acc, current) => Object.assign(acc, current), {})
                })
                .then((dirs) => {
                    return Object.assign({}, files, dirs)
                })
        })
        .then((res) => {
            return {
                type: 'Directory',
                content: res,
            }
            // return [].concat(notDirs, res)
        })
}

module.exports = readDirStructure
