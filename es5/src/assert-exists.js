var exists = require('./exists');

function assertExists(path) {
    return new Promise(function ($return, $error) {
        var doesExist;
        return Promise.resolve(exists(path)).then(function ($await_1) {
            try {
                doesExist = $await_1;
                if (!doesExist) {
                    return $error(new Error(`Path ${path} does not exist.`));
                }
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = assertExists;