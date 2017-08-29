'use strict'

const assert = require('assert')
const path = require('path')
const lib = require('../../src/lib/')
const WroteContext = require('../context/WroteContext')

const array = [
    'file.txt',
    {
        dirA: ['file2.txt'],
        dirB: [],
        dirC: [
            'file3.txt',
            {
                dirC1: ['file4.txt'],
            },
        ],
    },
]

const libTestSuite = {
    context: WroteContext,
    flatten: {
        'should return a list of all files': () => {
            const res = lib.flatten(array)
            assert.deepEqual(res, [
                'file.txt',
                path.join('dirA', 'file2.txt'),
                path.join('dirC', 'file3.txt'),
                path.join('dirC', 'dirC1', 'file4.txt'),
            ])
        },
    },
    flattenAll: {
        'should return a list of all files and folders': () => {
            const res = lib.flattenAll(array)
            assert.deepEqual(res, [
                'file.txt',
                'dirA/file2.txt',
                'dirC/file3.txt',
                'dirC/dirC1/file4.txt',
                'dirC/dirC1',
                'dirA',
                'dirB',
                'dirC',
            ])
        },
    },
}


module.exports = libTestSuite
