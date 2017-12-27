const recursive = {
    subdirectory: {
        'file.data': 'this is a file with some data\n',
        'file2.data': 'this is another file with some other data\n',
    },
    subdirectory2: {
        'file3.data': 'a file in another subdirectory\n',
        subsubdir: {
            'file4.py': 'sys.stderr.write(\'test-file\')\n',
        },
        subsubdir2: { },
    },
    'test.data': 'hello world\n',
}

const normal = {
    'test.data': 'hello world\n',
}

module.exports = {
    normal,
    recursive,
}
