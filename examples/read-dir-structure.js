const wrote = require('../')
const path = require('path')

const dirPath = path.join(__dirname, 'directory')

wrote.readDirStructure(dirPath)
    .then((res) => {
        console.log(res)
        // [ 'fileA.txt',
        //   'fileB.txt',
        //   'fileC.txt',
        //   { subdirectory: [ 'subdirFileA.txt', 'subdirFileB.txt' ] } ]
    })
    .catch(console.error)

