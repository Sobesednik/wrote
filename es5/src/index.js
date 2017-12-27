var wrote = require('./wrote');
var ensurePath = require('./ensure-path');
var write = require('./write');
var erase = require('./erase');
var read = require('./read');
var readDir = require('./read-dir');
var readDirStructure = require('./read-dir-structure');

wrote.ensurePath = ensurePath;
wrote.write = write;
wrote.erase = erase;
wrote.read = read;
wrote.readDir = readDir;
wrote.readDirStructure = readDirStructure;

module.exports = wrote;