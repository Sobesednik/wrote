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

## todo

- pass options to `fs.createWriteStream`

---

Licence: MIT

*(c) [Sobesednik-Media](https://sobesednik.media) 2017*
