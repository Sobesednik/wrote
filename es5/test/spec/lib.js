var _require = require('assert-diff'),
    deepEqual = _require.deepEqual;

var path = require('path');
var lib = require('../../src/lib/');

var array = ['file.txt', {
    dirA: ['file2.txt'],
    dirB: [],
    dirC: ['file3.txt', {
        dirC1: ['file4.txt']
    }]
}];

var libTestSuite = {
    flatten: {
        'should return a list of all files': function shouldReturnAListOfAllFiles() {
            var res = lib.flatten(array);
            deepEqual(res, ['file.txt', path.join('dirA', 'file2.txt'), path.join('dirC', 'file3.txt'), path.join('dirC', 'dirC1', 'file4.txt')]);
        }
    },
    flattenAll: {
        'should return a list of all files and folders': function shouldReturnAListOfAllFilesAndFolders() {
            var res = lib.flattenAll(array);
            deepEqual(res, ['file.txt', 'dirA/file2.txt', 'dirC/file3.txt', 'dirC/dirC1/file4.txt', 'dirC/dirC1', 'dirA', 'dirB', 'dirC']);
        }
    }
};

module.exports = libTestSuite;