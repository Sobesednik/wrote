const exists = require('./exists')

async function assertExists(path) {
    const doesExist = await exists(path)
    if (!doesExist) {
        throw new Error(`Path ${path} does not exist.`)
    }
}

module.exports = assertExists
