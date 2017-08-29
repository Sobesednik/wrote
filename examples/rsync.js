const wrote = require('../')
const path = require('path')

const dirPath = path.join(__dirname, 'directory')
const outputPath = path.join(__dirname, 'cloned-dir/')

let resultDir

wrote.rsync(dirPath, outputPath)
    .then((res) => {
        console.log(res)
        resultDir = res
        // ~/wrote/examples/cloned-dir/directory
    })
    .catch(console.error)


process.on('beforeExit', () => {
    console.log('before exit')
})
