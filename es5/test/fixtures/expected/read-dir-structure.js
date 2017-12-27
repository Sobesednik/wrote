var expected = {
    type: 'Directory',
    content: {
        'subdirectory-ln': { type: 'SymbolicLink' },
        'test-ln.data': { type: 'SymbolicLink' },
        'test.data': { type: 'File' },
        subdirectory: {
            type: 'Directory',
            content: {
                'file.data': { type: 'File' },
                'file2.data': { type: 'File' }
            }
        },
        subdirectory2: {
            type: 'Directory',
            content: {
                'file3.data': { type: 'File' },
                subsubdir: {
                    type: 'Directory',
                    content: {
                        'file4.py': { type: 'File' }
                    }
                },
                subsubdir2: {
                    type: 'Directory',
                    content: {}
                }
            }
        }
    }
};

module.exports = expected;