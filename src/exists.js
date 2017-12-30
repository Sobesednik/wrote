const makepromise = require('makepromise')
const { stat } = require('fs')

const testENOENT = (err) => {
    const { code } = err
    const isEnoent = code == 'ENOENT'
    if (isEnoent) {
        return false
    } else {
        throw err
    }
}

async function exists(path) {
    try {
        await makepromise(stat, path)
        return true
    } catch (err) {
        return testENOENT(err)
    }
}

module.exports = exists
