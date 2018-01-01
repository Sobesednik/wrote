var createWritable = require('./create-writable');
var write = require('./write');

/**
 * Serialise an object into JSON and write it to the file.
 * @param {string} path path to the file to write to
 * @param {object} object the object to stringify
 * @param {object} options
 * @param {function} [options.replacer] Stringify replacer
 * @param {string|number} [options.space] Stringify space
 */
function writeJSON(path, object) {
    var $args = arguments;return new Promise(function ($return, $error) {
        var options, _options$replacer, replacer, _options$space, space, ws, json;

        options = $args.length > 2 && $args[2] !== undefined ? $args[2] : {};
        _options$replacer = options.replacer, replacer = _options$replacer === undefined ? null : _options$replacer, _options$space = options.space, space = _options$space === undefined ? null : _options$space;
        return Promise.resolve(createWritable(path)).then(function ($await_1) {
            try {
                ws = $await_1;
                json = JSON.stringify(object, replacer, space);
                return Promise.resolve(write(ws, json)).then(function ($await_2) {
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
}

module.exports = writeJSON;