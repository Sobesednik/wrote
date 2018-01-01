const { resolve } = require('path')
const { readJSON } = require('..')

const path = resolve(__dirname, './directory/test.json');

(async () => {
    const res = await readJSON(path)
    console.log(res)
})().catch(console.error)
