var fs = require('fs');
var makePromise = require('makepromise');

var _require = require('path'),
    dirname = _require.dirname;

/**
 * Make sure that a file can be created by creating all directories to which it
 * belongs, e.g., ensurePath('/usr/local/test/wrote.data') will attempt to
 * create /usr/local/test/ directory recursivelly.
 * @param {string} path Path to the file
 * @returns {Promise.<string>} Same path as passed
 * @throws {Error} When the first folder in the path is non-executable
 */
function ensurePath(path) {
    return new Promise(function ($return, $error) {
        var dir;

        dir = dirname(path);
        var $Try_1_Post = function () {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);var $Try_1_Catch = function (err) {
            try {
                if (/EEXIST/.test(err.message) && err.message.indexOf(dir) != -1) {
                    return $return(path);
                }
                throw err;
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);try {
            return Promise.resolve(make(dir)).then(function ($await_4) {
                try {
                    return $return(path);
                } catch ($boundEx) {
                    return $Try_1_Catch($boundEx);
                }
            }.bind(this), $Try_1_Catch);
        } catch (err) {
            $Try_1_Catch(err)
        }
    }.bind(this));
}

/**
 * Recursive promise-based mkdir.
 * @param {string} dir Path to the directory to be created
 */
function make(dir) {
    return new Promise(function ($return, $error) {
        var res, parentDir, res2;
        var $Try_2_Post = function () {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);var $Try_2_Catch = function (err) {
            try {
                if (/ENOENT/.test(err.message)) {
                    parentDir = dirname(dir);
                    return Promise.resolve(make(parentDir)).then(function ($await_5) {
                        try {
                            return Promise.resolve(make(dir)).then(function ($await_6) {
                                try {
                                    res2 = $await_6;
                                    return $return(res2);
                                } catch ($boundEx) {
                                    return $error($boundEx);
                                }
                            }.bind(this), $error);
                        } catch ($boundEx) {
                            return $error($boundEx);
                        }
                    }.bind(this), $error);
                }
                throw err;
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);
        try {
            return Promise.resolve(makeDir(dir)).then(function ($await_7) {
                try {
                    res = $await_7;
                    return $return(res);
                } catch ($boundEx) {
                    return $Try_2_Catch($boundEx);
                }
            }.bind(this), $Try_2_Catch);
        } catch (err) {
            $Try_2_Catch(err)
        }
    }.bind(this));
}

/**
 * Promisified fs.mkdir
 * @param {string} dir directory name
 * @returns {string} created directory name
 */
function makeDir(dir) {
    return new Promise(function ($return, $error) {
        var res;
        return Promise.resolve(makePromise(fs.mkdir, dir, dir)).then(function ($await_8) {
            try {
                res = $await_8;
                return $return(res);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = ensurePath;
