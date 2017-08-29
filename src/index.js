const wrote = require('./wrote')
const ensurePath = require('./ensure-path')
const write = require('./write')
const erase = require('./erase')
const read = require('./read')
const readDir = require('./read-dir')
// const rsync = require('./rsync')
const readDirStructure = require('./read-dir-structure')

wrote.ensurePath = ensurePath
wrote.write = write
wrote.erase = erase
wrote.read = read
wrote.readDir = readDir
wrote.readDirStructure = readDirStructure
// wrote.rmrf = rmrf

module.exports = wrote
