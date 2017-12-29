function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _require = require('fs'),
    createReadStream = _require.createReadStream,
    readlink = _require.readlink,
    symlink = _require.symlink;

var _require2 = require('restream'),
    replaceStream = _require2.replaceStream;

var makePromise = require('makepromise/es5/src/');

var _require3 = require('path'),
    join = _require3.join;

var readDirStructure = require('./read-dir-structure');
var ensurePath = require('./ensure-path');
var write = require('./write');
var createWritable = require('./create-writable');

/**
 * @typedef {Object} Regex
 * @property {RegExp} re Regular expression to use, with possible /g flag
 * @property {string|function} replacement A string a function which returns a
 * string with a replacement
 */

/**
 * @typedef {Object} CloneConfig
 * @property {string} from directory to clone
 * @property {string} to directory to be the clone
 * @property {Regex[]} [regexes] a possible array of regular expressions to use
 */

/**
 * Create a clone of the directory somewhere else, by copying all files and
 * creating symlinks.
 * @param {CloneConfig} cloneConfig
 */
function clone(cloneConfig) {
    return new Promise(function ($return, $error) {
        var from, to, _cloneConfig$regexes, regexes, _ref, content, contentArray, files, filesPromises, dirs, dirsPromises, symlinks, symLinkPromises, promises;

        from = cloneConfig.from, to = cloneConfig.to, _cloneConfig$regexes = cloneConfig.regexes, regexes = _cloneConfig$regexes === undefined ? [] : _cloneConfig$regexes;
        return Promise.resolve(readDirStructure(from)).then(function ($await_1) {
            try {
                _ref = $await_1, content = _ref.content;

                contentArray = Object.keys(content).map(function (key) {
                    var value = content[key];
                    return Object.assign({ key }, value);
                });
                return Promise.resolve(ensurePath(join(to, 'ensure.data'))).then(function ($await_2) {
                    try {

                        files = contentArray.filter(function (_ref2) {
                            var type = _ref2.type;
                            return type === 'File';
                        });
                        filesPromises = files.map(function (_ref3) {
                            return new Promise(function ($return, $error) {
                                var key, fromPath, toPath, rs, re, finalStream, ws;
                                key = _ref3.key;

                                fromPath = join(from, key);
                                toPath = join(to, key);
                                rs = createReadStream(fromPath);
                                re = replaceStream(regexes);

                                finalStream = rs.pipe(re);
                                return Promise.resolve(createWritable(toPath)).then(function ($await_3) {
                                    try {
                                        ws = $await_3;

                                        return Promise.resolve(write(ws, finalStream)).then(function ($await_4) {
                                            try {
                                                return $return();
                                            } catch ($boundEx) {
                                                return $error($boundEx);
                                            }
                                        }.bind(this), $error);
                                    } catch ($boundEx) {
                                        return $error($boundEx);
                                    }
                                }.bind(this), $error);
                            }.bind(this));
                        });
                        dirs = contentArray.filter(function (_ref4) {
                            var type = _ref4.type;
                            return type === 'Directory';
                        });
                        dirsPromises = dirs.map(function (_ref5) {
                            return new Promise(function ($return, $error) {
                                var key, dirFrom, dirTo;
                                key = _ref5.key;

                                dirFrom = join(from, key);
                                dirTo = join(to, key);
                                return Promise.resolve(clone({
                                    from: dirFrom,
                                    to: dirTo,
                                    regexes
                                })).then(function ($await_5) {
                                    try {
                                        return $return();
                                    } catch ($boundEx) {
                                        return $error($boundEx);
                                    }
                                }.bind(this), $error);
                            }.bind(this));
                        });

                        symlinks = contentArray.filter(function (_ref6) {
                            var type = _ref6.type;
                            return type === 'SymbolicLink';
                        });
                        symLinkPromises = symlinks.map(function (_ref7) {
                            return new Promise(function ($return, $error) {
                                var key, linkFrom, path, target;
                                key = _ref7.key;

                                linkFrom = join(from, key);
                                path = join(to, key);
                                return Promise.resolve(makePromise(readlink, linkFrom)).then(function ($await_6) {
                                    try {
                                        target = $await_6;
                                        return Promise.resolve(makePromise(symlink, [target, path])).then(function ($await_7) {
                                            try {
                                                return $return();
                                            } catch ($boundEx) {
                                                return $error($boundEx);
                                            }
                                        }.bind(this), $error);
                                    } catch ($boundEx) {
                                        return $error($boundEx);
                                    }
                                }.bind(this), $error);
                            }.bind(this));
                        });

                        promises = [].concat(_toConsumableArray(filesPromises), _toConsumableArray(dirsPromises), _toConsumableArray(symLinkPromises));

                        return Promise.resolve(Promise.all(promises)).then(function ($await_8) {
                            try {
                                return $return();
                            } catch ($boundEx) {
                                return $error($boundEx);
                            }
                        }.bind(this), $error);
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }.bind(this), $error);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = clone;