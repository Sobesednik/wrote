'use strict'

const assert = require('assert')
const fs = require('fs')
const makePromise = require('makepromise')
const wrote = require('../../src/index')
const WroteContext = require('../context/WroteContext')

function assertFileExists(filepath) {
    return makePromise(fs.stat, filepath)
}

const eraseTestSuite = {
    context: WroteContext,
    'should erase passed file': (ctx) => {
        const file = ctx.tempFile
        return wrote(file)
            .then((ws) => {
                return wrote.erase(ws)
            })
            .then((ws) => {
                assert(ws.closed) // if node 6+, assert writable == false
                assert.equal(ws.path, file)
            })
            .then(() => ctx.assertFileDoesNotExist(file))
    },
    'should erase temp file': (ctx) => {
        let file
        let writeStream

        return wrote()
            .then((ws) => {
                writeStream = ws
                file = writeStream.path
                return wrote.erase(writeStream)
            })
            .then(() => {
                assert(writeStream.closed)
                assert.equal(writeStream.path, file)
            })
            .then(() => ctx.assertFileDoesNotExist(file))
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
                assert(writeStream.closed)
                assert.equal(writeStream.path, file)
            })
            .then(() => assertFileExists(file))
            .then(() => wrote.erase(writeStream))
            .then(() => ctx.assertFileDoesNotExist(file))
    },
}

module.exports = eraseTestSuite