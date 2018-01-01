var read = require('./read');

/**
 * Read contents of a JSON file and parse it.
 * @param {string} path path to the file to read
 * @return {Promise.<object>} Parsed JSON file.
 */
function readJSON(path) {
  return new Promise(function ($return, $error) {
    var file, parsed;
    return Promise.resolve(read(path)).then(function ($await_1) {
      try {
        file = $await_1;
        parsed = JSON.parse(file);
        return $return(parsed);
      } catch ($boundEx) {
        return $error($boundEx);
      }
    }.bind(this), $error);
  }.bind(this));
}

module.exports = readJSON;