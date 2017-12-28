const { read } = require('..');

(async () => {
    const res = await read(__filename)
    console.log(res)
})()
