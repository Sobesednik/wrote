const { read } = require('..');

(async () => {
    const res = await read(__filename)
    console.log(res)
    const buffer = await read(__filename, { binary: true })
    console.log(buffer) // <Buffer 63 6f 6e 73 74 20 7b 20 72 65 61 64 20 7d 20 3d 20 72 65 71 75 69 72 65 28 27 2e 2e 27 29 3b 0a 0a28 61 73 79 6e 63 20 28 29 20 3d 3e 20 7b 0a 20 20 ... >
})()
