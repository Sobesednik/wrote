const exists = require('./exists')

async function assertDoesNotExist(path) {
    const doesExist = await exists(path)
    if (doesExist) {
        throw new Error(`Path ${path} exists.`)
    }
}

module.exports = assertDoesNotExist
