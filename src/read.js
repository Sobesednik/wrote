const { createReadStream } = require('fs')
const Catchment = require('catchment')

/**
 * Read contents of a file to a variable.
 * @param {string} path path to the file to read
 * @param {object} options options
 * @param {boolean} [options.binary=false] whether to return a Buffer instead of a
 * string
 * @returns {Promise<string>} Resolves with contents of the file, rejects if
 * file not found.
 */
async function read(path, options = {}) {
    const { binary = false } = options
    const rs = createReadStream(path)
    const catchmentRes = await new Promise(async (resolve, reject) => {
        rs.on('error', reject)
        const { promise } = new Catchment({ rs, binary })
        const res = await promise
        resolve(res)
    })
    return catchmentRes
}

module.exports = read
