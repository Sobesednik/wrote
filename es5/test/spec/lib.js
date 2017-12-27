'use strict';

var assert = require('assert');
var path = require('path');
var lib = require('../../src/lib/');
var WroteContext = require('../context/WroteContext');

var array = ['file.txt', {
    dirA: ['file2.txt'],
    dirB: [],
    dirC: ['file3.txt', {
        dirC1: ['file4.txt']
    }]
}];

var libTestSuite = {
    context: WroteContext,
    flatten: {
        'should return a list of all files': function shouldReturnAListOfAllFiles() {
            var res = lib.flatten(array);
            assert.deepEqual(res, ['file.txt', path.join('dirA', 'file2.txt'), path.join('dirC', 'file3.txt'), path.join('dirC', 'dirC1', 'file4.txt')]);
        }
    },
    flattenAll: {
        'should return a list of all files and folders': function shouldReturnAListOfAllFilesAndFolders() {
            var res = lib.flattenAll(array);
            assert.deepEqual(res, ['file.txt', 'dirA/file2.txt', 'dirC/file3.txt', 'dirC/dirC1/file4.txt', 'dirC/dirC1', 'dirA', 'dirB', 'dirC']);
        }
    }
};

module.exports = libTestSuite;