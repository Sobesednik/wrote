const createWritable = require('./create-writable')
const write = require('./write')

/**
 * Serialise an object into JSON and write it to the file.
 * @param {string} path path to the file to write to
 * @param {object} object the object to stringify
 * @param {object} options
 * @param {function} [options.replacer] Stringify replacer
 * @param {string|number} [options.space] Stringify space
 */
async function writeJSON(path, object, options = {}) {
    const {
        replacer = null,
        space = null,
    } = options
    const ws = await createWritable(path)
    const json = JSON.stringify(object, replacer, space)
    await write(ws, json)
}

module.exports = writeJSON
