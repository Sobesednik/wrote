const { ensurePath } = require('..')
const { resolve } = require('path');

(async () => {
    const path = 'path/to/temp/file.data'
    const res = await ensurePath(path)
    console.log(res) // path/to/temp/file.data, path/to/temp is created in your cwd

    const absolutePath = resolve(process.cwd(), 'path/to/temp/file.data')
    const res2 = await ensurePath(absolutePath)
    console.log(res2) // $(pwd)/path/to/temp/file.data
})()
