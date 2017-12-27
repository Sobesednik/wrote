const fs = require('fs')

const symlinkSync = fs.symlinkSync
const mkdirSync = fs.mkdirSync

symlinkSync('./directory', './es5/test/fixtures/directory-ln', 'dir')
symlinkSync('./subdirectory', './es5/test/fixtures/directory/subdirectory-ln', 'dir')
symlinkSync('test.data', './es5/test/fixtures/directory/test-ln.data')
mkdirSync('./es5/test/fixtures/directory/subdirectory2/subsubdir2')
