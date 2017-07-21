const expected = [
    'test-ln.data',
    'test.data',
    {
        subdirectory: [
            'file.data',
            'file2.data',
        ],
        subdirectory2: [
            'file3.data',
            {
                subsubdir: [
                    'file4.js',
                ],
                subsubdir2: [],
            },
        ],
    },
]

module.exports = expected
