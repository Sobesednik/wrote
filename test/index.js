const assert = require('assert')
const Writable = require('stream').Writable
const path = require('path')
const os = require('os')
const fs = require('fs')
const makePromise = require('makepromise')
const wrote = require('../src/index')

const createTempFilePath = () => {
    return path.join(os.tmpdir(), `wrote-test-${Math.floor(Math.random() * 1e3)}.data`)
}

function Context() {
    Object.defineProperties(this, {
        tempFile: {
            get: () => createTempFilePath(),
        },
    })
}
const wroteTestSuite = {
    context: Context,
    'should be a function': () => {
        assert(typeof wrote === 'function')
    },
    'should return a promise': () => {
        const res = wrote()
        assert(res instanceof Promise)
        return res.catch(() => {})
    },
    'should resolve with a write stream': () => {
        const res = wrote()
            .then((ws) => {
                assert(ws instanceof Writable)
            })
        return res
    },
    'should open specified file': (ctx) => {
        const file = ctx.tempFile
        return wrote(file)
            .then((ws) => {
                assert.equal(ws.path, file)
                assert(ws instanceof Writable && ws.writable)
            })
    },
    'should be able to stop stream': (ctx) => {
        const file = ctx.tempFile
        return wrote(file)
            .then((ws) => {
                const promise = new Promise((resolve, reject) => {
                    ws.once('close', () => resolve(ws))
                    ws.once('error', reject)
                    ws.close()
                })
                return promise
            })
    },
}

function assertFileDoesNotExist(filepath) {
    return makePromise(fs.stat, filepath)
        .then(() => {
            throw new Error('should have been rejected')
        }, (err) => {
            assert(/^ENOENT: no such file or directory/.test(err.message))
        })
}

function assertFileExists(filepath) {
    return makePromise(fs.stat, filepath)
}

const eraseTestSuite = {
    context: Context,
    'should erase passed file': (ctx) => {
        const file = ctx.tempFile
        return wrote(file)
            .then((ws) => {
                return wrote.erase(ws)
            })
            .then((ws) => {
                assert(!ws.writable)
                assert.equal(ws.path, file)
            })
            .then(() => assertFileDoesNotExist(file))
    },
    'should erase temp file': () => {
        'use strict'
        let file
        return wrote()
            .then((ws) => {
                file = ws.path
                return wrote.erase(ws)
            })
            .then((ws) => {
                assert(!ws.writable)
                assert.equal(ws.path, file)
            })
            .then(() => assertFileDoesNotExist(file))
    },
    'should erase file even if stream is closed': (ctx) => {
        const file = ctx.tempFile
        let writeStream
        return wrote(file)
            .then((ws) => {
                writeStream = ws
                return makePromise(writeStream.end.bind(writeStream))
            })
            .then(() => {
                assert(!writeStream.writable) // ended writable stream
                assert.equal(writeStream.path, file)
            })
            .then(() => assertFileExists(file))
            .then(() => wrote.erase(writeStream))
            .then(() => assertFileDoesNotExist(file))
    },
}

module.exports = {
    wroteTestSuite,
    eraseTestSuite,
}
