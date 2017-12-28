const { write } = require('../')
const assert = require('assert')
const { Writable } = require('stream')

const testString = 'hello world'
const buffer = Buffer.from(testString)
const allRawData = []
const ws = new Writable({
    write(chunk, encoding, next) {
        allRawData.push(chunk)
        next()
    },
});

(async () => {
    await write(ws, buffer)
    console.log(allRawData.map(d => String(d))) // [ 'hello world' ]
    assert.deepEqual(allRawData, [
        buffer,
    ])
})()
