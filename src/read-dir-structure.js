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
async function readDirStructure(dirPath) {
    if (!dirPath) {
        throw new Error('Please specify a path to the directory')
    }
    const lstat = await makePromise(fs.lstat, dirPath)
    if (!lstat.isDirectory()) {
        const err = new Error('Path is not a directory')
        err.code = 'ENOTDIR'
        throw err
    }
    const dir = await makePromise(fs.readdir, dirPath)
    const lstatRes = await lib.lstatFiles(dirPath, dir)

    const directories = lstatRes.filter(isDirectory)
    const notDirectories = lstatRes.filter(isNotDirectory)

    const files = notDirectories.reduce((acc, lstatRes) => Object.assign(acc, {
        [lstatRes.relativePath]: {
            type: getType(lstatRes),
        },
    }), {})

    const dirPromises = directories.map(async ({ path, relativePath }) => {
        const structure = await readDirStructure(path)
        return [relativePath, structure]
    })
    const dirsArray = await Promise.all(dirPromises)
    const dirs = dirsArray.reduce(
        (acc, [relativePath, structure]) => {
            const d = { [relativePath]: structure }
            return Object.assign(acc, d)
        }, {}
    )
    const merged = Object.assign({}, files, dirs)
    return {
        type: 'Directory',
        content: merged,
    }
}

module.exports = readDirStructure
