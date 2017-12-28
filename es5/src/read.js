var _require = require('fs'),
    createReadStream = _require.createReadStream;

var Catchment = require('catchment');

/**
 * Read contents of a file to a variable.
 * @param {string} filePath path to the file to read
 * @returns {Promise<string>} Resolves with contents of the file, rejects if
 * file not found.
 */
function read(filePath) {
    return new Promise(function ($return, $error) {
        var rs, catchmentRes;

        rs = createReadStream(filePath);
        return Promise.resolve(new Promise(function (resolve, reject) {
            return new Promise(function ($return, $error) {
                var catchment, res;

                rs.on('error', reject);
                catchment = new Catchment();
                rs.pipe(catchment);
                return Promise.resolve(catchment.promise).then(function ($await_1) {
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