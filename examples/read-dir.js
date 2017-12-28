const { readDir } = require('..')
const path = require('path')

const dirPath = path.join(__dirname, 'directory');

(async () => {
    const res = await readDir(dirPath)
    console.log(res)
    // { 'fileA.txt': 'fileA\n',
    //   'fileB.txt': 'fileB\n',
    //   'fileC.txt': 'fileC\n' }
})();

(async () => {
    const res = await readDir(dirPath, true)
    console.log(res)
    // { 'fileA.txt': 'fileA\n',
    //   'fileB.txt': 'fileB\n',
    //   'fileC.txt': 'fileC\n',
    //   subdirectory:
    //    { 'subdirFileA.txt': 'subdirFileA\n',
    //      'subdirFileB.txt': 'subdirFileB\n' } }
})()
