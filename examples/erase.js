const { Writable } = require('stream')
const path = require('path')
const HOME_DIR = require('os').homedir()
const { createWritable, erase } = require('..')

const file = path.join(HOME_DIR, `wrote-${Math.floor(Math.random() * 1e5)}.data`);

(async () => {
    const ws = await createWritable(file)
    console.log(ws instanceof Writable) // true
    console.log(ws.writable) // true
    console.log(ws.path) // ~/wrote-35558.data
    await erase(ws)
    console.log(ws.closed) // true
})()
