const { resolve } = require('path')
const { clone } = require('..');

(async () => {
    const from = resolve(__dirname, 'directory')
    const to = resolve(__dirname, 'clone')

    await clone({
        from,
        to,
        regexes: [
            {
                re: /fileA/g,
                replacement: 'clonedFileA',
            },
            {
                re: /fileB/,
                replacement: 'clonedFileB',
            },
        ],
    })
})().catch(console.error)
