const { assertExists } = require('..');

(async () => {
    try {
        await assertExists('unknown-path')
    } catch (err) {
        console.log(err) // Path unknown-path does not exist.
    }
    await assertExists(__filename) // ok
})()
