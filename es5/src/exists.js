var makepromise = require('makepromise/es5/src/');

var _require = require('fs'),
    stat = _require.stat;

var testENOENT = function testENOENT(err) {
    var code = err.code;

    var isEnoent = code == 'ENOENT';
    if (isEnoent) {
        return false;
    } else {
        throw err;
    }
};

function exists(path) {
    return new Promise(function ($return, $error) {
        var $Try_1_Post = function () {
            try {
                return $return();
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);var $Try_1_Catch = function (err) {
            try {
                return $return(testENOENT(err));
            } catch ($boundEx) {
                return $error($boundEx);
            }
        }.bind(this);
        try {
            return Promise.resolve(makepromise(stat, path)).then(function ($await_2) {
                try {
                    return $return(true);
                } catch ($boundEx) {
                    return $Try_1_Catch($boundEx);
                }
            }.bind(this), $Try_1_Catch);
        } catch (err) {
            $Try_1_Catch(err)
        }
    }.bind(this));
}

module.exports = exists;