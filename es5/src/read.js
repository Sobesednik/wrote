var _require = require('fs'),
    createReadStream = _require.createReadStream;

var Catchment = require('catchment/es5');

/**
 * Read contents of a file to a variable.
 * @param {string} path path to the file to read
 * @param {object} options options
 * @param {boolean} [options.binary=false] whether to return a Buffer instead of a
 * string
 * @returns {Promise<string>} Resolves with contents of the file, rejects if
 * file not found.
 */
function read(path) {
    var $args = arguments;return new Promise(function ($return, $error) {
        var options, _options$binary, binary, rs, catchmentRes;

        options = $args.length > 1 && $args[1] !== undefined ? $args[1] : {};
        _options$binary = options.binary, binary = _options$binary === undefined ? false : _options$binary;

        rs = createReadStream(path);
        return Promise.resolve(new Promise(function (resolve, reject) {
            return new Promise(function ($return, $error) {
                var _ref, promise, res;

                rs.on('error', reject);
                _ref = new Catchment({ rs, binary }), promise = _ref.promise;
                return Promise.resolve(promise).then(function ($await_1) {
                    try {
                        res = $await_1;
                        resolve(res);
                        return $return();
                    } catch ($boundEx) {
                        return $error($boundEx);
                    }
                }.bind(this), $error);
            }.bind(this));
        })).then(function ($await_2) {
            try {
                catchmentRes = $await_2;
                return $return(catchmentRes);
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = read;