'use strict'
const fs = require('fs')
const makePromise = require('makepromise')
const lib = require('./lib/')

/**
 * Read a directory, and return directory structure as an object
 * @param {string} dirPath Path to the directory
 * @returns {Promise<object>} An object reflecting directory structure, e.g.,
 * { dir: subdir: { 'fileA.txt': 'foo', 'fileB.js': 'bar' }, 'fileC.jpg': 'baz' }
 */
function readDirStructure(dirPath) {
    if (!dirPath) {
        return Promise.reject(new Error('Please give path to directory'))
    }
    let notDirs
    return makePromise(fs.readdir, [dirPath])
        .then((res) => {
            return lib.lstatFiles(dirPath, res)
        })
        .then((lstatRes) => {
            const directories = lstatRes.filter((lstatRes) => {
                return lstatRes.lstat.isDirectory()
            })
            const notDirectories = lstatRes.filter((lstatRes) => {
                return !lstatRes.lstat.isDirectory()
            })
            notDirs = notDirectories.map(lstatRes => lstatRes.relativePath)
            const dirPaths = Promise.all(directories.map((dir) => {
                return readDirStructure(dir.path)
                    .then((res) => ({
                        [dir.relativePath]: res,
                    }))
            }))
            return dirPaths
                .then((allDirs) => {
                    if (!allDirs.length) return []
                    return allDirs.reduce((acc, current) => {
                        return Object.assign({}, acc, current)
                    }, {})
                })
        })
        .then((res) => {
            return [].concat(notDirs, res)
        })
}

module.exports = readDirStructure
