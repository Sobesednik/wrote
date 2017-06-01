const fs = require('fs')
const Catchment = require('catchment')

/**
 * Read contents of a file to a variable.
 * @param {string} filePath path to the file to read
 * @returns {Promise<string>} Resolves with contents of the file, rejects if
 * file not found.
 */
function read(filePath) {
    const rs = fs.createReadStream(filePath)
    return new Promise((resolve, reject) => {
        rs.on('error', reject)
        const catchment = new Catchment()
        rs.pipe(catchment)
        return catchment.promise
            .then(resolve)
    })
}

module.exports = read
