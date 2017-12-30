var exists = require('./exists');

function assertDoesNotExist(path) {
    return new Promise(function ($return, $error) {
        var doesExist;
        return Promise.resolve(exists(path)).then(function ($await_1) {
            try {
                doesExist = $await_1;
                if (doesExist) {
                    return $error(new Error(`Path ${path} exists.`));
                }
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this), $error);
    }.bind(this));
}

module.exports = assertDoesNotExist;