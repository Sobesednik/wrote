# wrote

[![npm version](https://badge.fury.io/js/wrote.svg)](https://badge.fury.io/js/wrote)

Promise-based write for Node.js

## `wrote(filepath?:String) => Promise<Writable> (ws.writable == true)`

Create a write stream to your file without hastle.

```js
const Writable = require('stream').Writable
const path = require('path')
const wrote = require('./')
const HOME_DIR = require('os').homedir()

const file = path.join(HOME_DIR, `wrote-${Math.floor(Math.random() * 1e5)}.data`)

return wrote(file)
    .then((ws) => {
        console.log(ws instanceof Writable) // true
        console.log(ws.path) // ~/wrote-35558.data
    })
    .catch(console.error)

```

If you don't have a  file, a new one in the temp directory will be created for you.

```js
const wrote = require('wrote')
const Writable = require('stream').Writable

return wrote()
    .then((ws) => {
        console.log(ws instanceof Writable) // true
        console.log(ws.path) // /var/folders/s0/l33t/T/wrote-35558.data
    })
    .catch(console.error)
```

## `wrote.erase(ws:Writable) => Promise<Writable> (ws.writable == false)`

Erase file and close stream.

```js
const wrote = require('wrote')
const Writable = require('stream').Writable
const path = require('path')
const HOME_DIR = require('os').homedir()
const fs = require('fs')

const file = path.join(HOME_DIR, `wrote-${Math.floor(Math.random() * 1e5)}.data`)

return wrote(file)
    .then((ws) => {
        console.log(ws instanceof Writable) // true
        console.log(ws.writable) // true
        console.log(ws.path) // ~/wrote-35558.data
        return wrote.erase(ws)
    })
    .then((ws) => {
        console.log(ws.path) // ~/wrote-35558.data, but no longer exists
        console.log(ws.writable) // false
    })
    .catch(console.error)
```

## wrote.write(ws:Writable, data:any|Readable) => Promise<Writable>

Pipe a `Readable` to the `Writable` stream and wait until it is finished, or end `Writable` with
given data (pass `null` to end stream without any more data).

```js
const wrote = require('wrote')
const assert = require('assert')
const Writable = require('stream').Writable

const testString = 'hello world'
const buffer = Buffer.from(testString)
const allRawData = []
const ws = new Writable({
    write: (chunk, encoding, next) => {
        allRawData.push(chunk)
        next()
    },
})
wrote.write(ws, buffer)
    .then(() => {
        console.log(allRawData.map(d => String(d))) // [ 'hello world' ]
        assert.deepEqual(allRawData, [
            buffer,
        ])
    })
    .catch(console.error)
```

## wrote.ensurePath(filePath:string) => Promise<string>

Create all required directories for the filepath to exist. If a directory on the way is
non-executable, the promise will be rejected. Resolves with the filepath.

```js
const wrote = require('wrote')
const tempPath = 'path/to/temp/file.data'
const path = require('path')

wrote.ensurePath(tempPath)
    .then((res) => {
        console.log(res) // path/to/temp/file.data, path/to/temp is created in your cwd
    })
    .then(() => {
        const absolutePath = path.join(process.cwd(), tempPath)
        return wrote.ensurePath(absolutePath)
    })
    .then((res) => {
        console.log(res) // $(pwd)/path/to/temp/file.data, using previously created path
    })
```

## todo

- pass options to `fs.createWriteStream`

---

Licence: MIT

*(c) [Sobesednik-Media](https://sobesednik.media) 2017*
