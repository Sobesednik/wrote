const { deepEqual } = require('assert-diff')
const path = require('path')
const lib = require('../../src/lib/')

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
    flatten: {
        'should return a list of all files': () => {
            const res = lib.flatten(array)
            deepEqual(res, [
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
            deepEqual(res, [
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
