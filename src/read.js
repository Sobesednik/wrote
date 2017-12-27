const { createReadStream } = require('fs')
const Catchment = require('catchment')

/**
 * Read contents of a file to a variable.
 * @param {string} filePath path to the file to read
 * @returns {Promise<string>} Resolves with contents of the file, rejects if
 * file not found.
 */
async function read(filePath) {
    const rs = createReadStream(filePath)
    const catchmentRes = await new Promise(async (resolve, reject) => {
        rs.on('error', reject)
        const catchment = new Catchment()
        rs.pipe(catchment)
        const res = await catchment.promise
        resolve(res)
    })
    return catchmentRes
}

module.exports = read
