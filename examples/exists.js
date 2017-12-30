const { exists } = require('..');

(async () => {
    const doesExist = await exists('unknown-path')
    console.log(doesExist) // false
    const doesExist2 = await exists(__filename)
    console.log(doesExist2) // true
    const doesExist3 = await exists(__dirname)
    console.log(doesExist3) // true
})()
