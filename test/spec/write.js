const { Readable, Writable } = require('stream')
const { throws } = require('zoroaster/assert')
const assert = require('assert')
const Catchment = require('catchment')
const write = require('../../src/write')

function createWs(nextArg) {
    const allData = []
    const allRawData = []
    const ws = new Writable({
        write: (chunk, encoding, next) => {
            allData.push(String(chunk))
            allRawData.push(chunk)
            next(nextArg)
        },
    })
    return { ws, allData, allRawData }
}

const writeTestSuite = {
    async 'should write a string to the stream'() {
        const testString = 'hello world'
        const { ws, allData } = createWs()
        await write(ws, testString)
        assert.deepEqual(allData, [testString])
        assert(ws._writableState.ended)
    },
    async 'should pipe a readable to the stream'() {
        const testString = 'hello world'
        const { ws, allData } = createWs()
        const rs = new Readable({
            read() {
                this.push(testString)
                this.push(null)
            },
        })
        const resWs = await write(ws, rs)
        assert.strictEqual(resWs, ws)
        assert.deepEqual(allData, [testString])
        assert(ws._writableState.ended)
    },
    async 'should reject when reabable is not readable'() {
        const testString = 'hello world'
        const { ws } = createWs()
        const rs = new Readable({
            read() {
                this.push(testString)
                this.push(null)
            },
        })
        const { promise } = new Catchment({ rs })
        await promise

        await throws({
            fn: write,
            args: [ws, rs],
            message: 'Stream is not readable',
        })
    },
    async 'should reject when readable throws'() {
        const { ws } = createWs()
        const error = new Error('test-error')
        const rs = new Readable({
            read() {
                process.nextTick(() => this.emit('error', error))
            },
        })
        await throws({
            fn: write,
            args: [ws, rs],
            error,
        })
    },
    async 'should reject when writable throws'() {
        const testString = 'hello world'
        const error = new Error('test-error')
        const { ws } = createWs(error)
        const rs = new Readable({
            read() {
                rs.push(testString)
                rs.push(null)
            },
        })
        await throws({
            fn: write,
            args: [ws, rs],
            error,
        })
    },
    async 'should write nothing when null given'() {
        const { ws, allData } = createWs()
        await write(ws, null)
        assert.deepEqual(allData, [])
        assert(ws._writableState.ended)
    },
    async 'should write buffer'() {
        const testString = 'hello world'
        const buffer = Buffer.from(testString)
        const { ws, allRawData } = createWs()
        await write(ws, buffer)
        assert.deepEqual(allRawData, [buffer])
        assert(ws._writableState.ended)
    },
    async 'should reject if writable is not Writable'() {
        await throws({
            fn: write,
            args: ['string'],
            message: 'Writable stream expected',
        })
    },
}

module.exports = writeTestSuite
