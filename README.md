# wrote

[![npm version](https://badge.fury.io/js/wrote.svg)](https://badge.fury.io/js/wrote)

Promise-based write and read operations for Node.js

## ES5

The package uses some newer language features. For your convenience, it's been
transpiled to be compatible with Node 4. You can use the following snippet.

```js
const wrote = require('wrote/es5/src/')
```

## Version 1.0.0 breaking change

> The package now exports an object with functions, and `wrote` function to
> create an open writable stream is renamed to `createWritable`.

## `wrote.createWritable(path=: string): Promise.<Writable>`

Create an open Writable stream to the file.

```js
const { Writable } = require('stream')
const path = require('path')
const HOME_DIR = require('os').homedir()
const { createWritable } = require('wrote')

const file = path.join(HOME_DIR, `wrote-${Math.floor(Math.random() * 1e5)}.data`);

(async () => {
    const ws = await createWritable(file)
    console.log(ws instanceof Writable) // true
    console.log(ws.path) // ~/wrote-35558.data
})()
```

If you don't have a file, a new one in the temp directory will be created for you.

```js
(async () => {
    const ws = await createWritable()
    console.log(ws instanceof Writable) // true
    console.log(ws.path) // /var/folders/s0/1h2g/T/wrote-48315.data
})()
```

## `wrote.erase(ws: Writable): Promise.<Writable>`

Erase file and close stream.

```js
const { createWritable, erase } = require('wrote')
const { Writable } = require('stream')
const path = require('path')
const HOME_DIR = require('os').homedir()

const file = path.join(HOME_DIR, `wrote-${Math.floor(Math.random() * 1e5)}.data`);

(async () => {
    const ws = await createWritable(file)
    console.log(ws instanceof Writable) // true
    console.log(ws.writable) // true
    console.log(ws.path) // ~/wrote-35558.data
    await erase(ws)
    console.log(ws.closed) // true
})()

```

## `wrote.write(ws: Writable, data?: string|Readable): Promise.<Writable>`

Pipe a `Readable` to the `Writable` stream and wait until it is finished, or end
 `Writable` with given data (pass `null` to end stream without any more data).

```js
const { write } = require('wrote')
const assert = require('assert')
const { Writable } = require('stream')

const testString = 'hello world'
const buffer = Buffer.from(testString)
const allRawData = []
const ws = new Writable({
    write(chunk, encoding, next) {
        allRawData.push(chunk)
        next()
    },
});

(async () => {
    await write(ws, buffer)
    console.log(allRawData.map(d => String(d))) // [ 'hello world' ]
    assert.deepEqual(allRawData, [
        buffer,
    ])
})()
```

## `wrote.ensurePath(filePath: string): Promise<string>`

Create all required directories for the filepath to exist. If a directory on the way is
non-executable, the Promise will be rejected. Resolves with the filepath.

```js
const { ensurePath } = require('wrote')
const { resolve } = require('path');

(async () => {
    const path = 'path/to/temp/file.data'
    const res = await ensurePath(path)
    console.log(res) // path/to/temp/file.data, path/to/temp is created in your cwd

    const absolutePath = resolve(process.cwd(), 'path/to/temp/file.data')
    const res2 = await ensurePath(absolutePath)
    console.log(res2) // $(pwd)/path/to/temp/file.data
})()
```

## `wrote.read(filePath: string): Promise<string>`

Read a file fully. Returns a Promise resolved with the file contents, and
rejects if path is not a string or file not found (`ENOENT`).

```js
const { read } = require('wrote');

(async () => {
    const res = await read(__filename)
    console.log(res)
})()
```

`examples/read.js`: _this program will print the contents of itself_

## `wrote.readDir(dirPath: string, recursive=: boolean): Promise<object>`

Read a directory, and return contents of contained files.

For example, the following directory structure:

```fs
directory
 - subdirectory
    - subdirFileA.txt
    ` subdirFileB.txt
 - fileA.txt
 - fileB.txt
 ` fileC.txt
```

can be read either shallowly (by default):

```js
const { readDir } = require('wrote')
const path = require('path')

const dirPath = path.join(__dirname, 'directory');

(async () => {
    const res = await readDir(dirPath)
    console.log(res)
    // { 'fileA.txt': 'fileA\n',
    //   'fileB.txt': 'fileB\n',
    //   'fileC.txt': 'fileC\n' }
})()
```

or recursively:

```js
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
```

## `wrote.readDirStructure(dirPath: string): Promise<DirectoryStructure>`

Get the full structure of the directory recursively. An array of either
file names as strings, or an object representing all directories of the
current one, with keys being their names, and values being arrays similar
to the root one.

```js
const path = require('path')
const { readDirStructure } = require('..')

const DIR_PATH = path.join(__dirname, '../test/fixtures/directory');

/**
 * Read directory's structure.
 */

(async () => {
    const res = await readDirStructure(DIR_PATH)
    console.log(JSON.stringify(res, null, 2))
})()
```

```fs
{
  "type": "Directory",
  "content": {
    "subdirectory-ln": {
      "type": "SymbolicLink"
    },
    "test-ln.data": {
      "type": "SymbolicLink"
    },
    "test.data": {
      "type": "File"
    },
    "subdirectory": {
      "type": "Directory",
      "content": {
        "file.data": {
          "type": "File"
        },
        "file2.data": {
          "type": "File"
        }
      }
    },
    "subdirectory2": {
      "type": "Directory",
      "content": {
        "file3.data": {
          "type": "File"
        },
        "subsubdir": {
          "type": "Directory",
          "content": {
            "file4.py": {
              "type": "File"
            }
          }
        },
        "subsubdir2": {
          "type": "Directory",
          "content": {}
        }
      }
    }
  }
}
```

## todo

- pass options to `fs.createWriteStream` in `wrote.createWritable`

---

Licence: MIT

*(c) [Sobesednik-Media](https://sobesednik.media) 2017*
