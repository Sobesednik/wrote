const { createReadStream, readlink, symlink } = require('fs')
const { replaceStream } = require('restream')
const makePromise = require('makepromise')
const { join } = require('path')
const readDirStructure = require('./read-dir-structure')
const ensurePath = require('./ensure-path')
const write = require('./write')
const createWritable = require('./create-writable')

/**
 * @typedef {Object} Regex
 * @property {RegExp} re Regular expression to use, with possible /g flag
 * @property {string|function} replacement A string a function which returns a
 * string with a replacement
 */

/**
 * @typedef {Object} CloneConfig
 * @property {string} from directory to clone
 * @property {string} to directory to be the clone
 * @property {Regex[]} [regexes] a possible array of regular expressions to use
 */

/**
 * Create a clone of the directory somewhere else, by copying all files and
 * creating symlinks.
 * @param {CloneConfig} cloneConfig
 */
async function clone(cloneConfig) {
    const {
        from,
        to,
        regexes = [],
    } = cloneConfig
    const { content } = await readDirStructure(from)
    const contentArray = Object.keys(content).map((key) => {
        const value = content[key]
        return Object.assign({ key }, value)
    })
    await ensurePath(join(to, 'ensure.data'))

    const files = contentArray
        .filter(({ type }) => type === 'File')
    const filesPromises = files.map(async ({ key }) => {
        const fromPath = join(from, key)
        const toPath = join(to, key)
        const rs = createReadStream(fromPath)
        const re = replaceStream(regexes)

        const finalStream = rs.pipe(re)
        const ws = await createWritable(toPath)

        await write(ws, finalStream)
    })
    const dirs = contentArray
        .filter(({ type }) => type === 'Directory')
    const dirsPromises = dirs.map(async ({ key }) => {
        const dirFrom = join(from, key)
        const dirTo = join(to, key)
        await clone({
            from: dirFrom,
            to: dirTo,
            regexes,
        })
    })

    const symlinks = contentArray
        .filter(({ type }) => type === 'SymbolicLink')
    const symLinkPromises = symlinks.map(async ({ key }) => {
        const linkFrom = join(from, key)
        const path = join(to, key)
        const target = await makePromise(readlink, linkFrom)
        await makePromise(symlink, [target, path])
    })

    const promises = [...filesPromises, ...dirsPromises, ...symLinkPromises]

    await Promise.all(promises)
}

module.exports = clone
