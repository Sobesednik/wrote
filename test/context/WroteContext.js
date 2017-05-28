const path = require('path')
const os = require('os')
const fs = require('fs')
const makePromise = require('makepromise')
const assert = require('assert')

const createTempFilePath = () => {
    return path.join(os.tmpdir(), `wrote-test-${Math.floor(Math.random() * 1e3)}.data`)
}

function assertFileDoesNotExist(filepath) {
    return makePromise(fs.stat, filepath)
        .then(() => {
            throw new Error('should have been rejected')
        }, (err) => {
            assert(/^ENOENT: no such file or directory/.test(err.message))
        })
}


function WroteContext() {
    Object.defineProperties(this, {
        tempFile: {
            get: () => createTempFilePath(),
        },
        assertFileDoesNotExist: {
            get: () => assertFileDoesNotExist,
        },
    })
}

module.exports = WroteContext
