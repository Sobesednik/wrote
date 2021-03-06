const path = require('path')
const { readDirStructure } = require('..')

const DIR_PATH = path.join(__dirname, '../test/fixtures/directory');

/**
 * Read directory's structure.
 */

(async () => {
    const res = await readDirStructure(DIR_PATH)
    console.log(JSON.stringify(res, null, 2))
    // {
    //   "type": "Directory",
    //   "content": {
    //     "subdirectory-ln": {
    //       "type": "SymbolicLink"
    //     },
    //     "test-ln.data": {
    //       "type": "SymbolicLink"
    //     },
    //     "test.data": {
    //       "type": "File"
    //     },
    //     "subdirectory": {
    //       "type": "Directory",
    //       "content": {
    //         "file.data": {
    //           "type": "File"
    //         },
    //         "file2.data": {
    //           "type": "File"
    //         }
    //       }
    //     },
    //     "subdirectory2": {
    //       "type": "Directory",
    //       "content": {
    //         "file3.data": {
    //           "type": "File"
    //         },
    //         "subsubdir": {
    //           "type": "Directory",
    //           "content": {
    //             "file4.js": {
    //               "type": "File"
    //             }
    //           }
    //         },
    //         "subsubdir2": {
    //           "type": "Directory",
    //           "content": {}
    //         }
    //       }
    //     }
    //   }
    // }
})()

