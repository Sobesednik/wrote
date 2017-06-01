const wrote = require('./wrote')
const ensurePath = require('./ensure-path')
const write = require('./write')
const erase = require('./erase')

wrote.ensurePath = ensurePath
wrote.write = write
wrote.erase = erase

module.exports = wrote
