const { assertDoesNotExist } = require('..');

(async () => {
    try {
        await assertDoesNotExist(__filename)
    } catch (err) {
        console.log(err) // Path __filename exists.
    }
    await assertDoesNotExist('unknown-file') // ok
})()
