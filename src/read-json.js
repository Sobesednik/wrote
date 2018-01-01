const read = require('./read')

/**
 * Read contents of a JSON file and parse it.
 * @param {string} path path to the file to read
 * @return {Promise.<object>} Parsed JSON file.
 */
async function readJSON(path) {
    const file = await read(path)
    const parsed = JSON.parse(file)
    return parsed
}

module.exports = readJSON
