const spawnCommand = require('spawncommand')
const path = require('path')

/**
 * Run rsync command, with -av args by default
 * @param {string} from path to the directory to clone from
 * @param {string} to path to the directory to place the new directory into
 * @param {string} [args=-av] args to pass
 * @param {object} [options] Options to spawn child process with
 * @returns {Promise<string>} A promise resolved with the path to the clone
 */
function rsync(from, to, args, options) {
    const fullTo = path.join(to, path.basename(from))
    const proc = spawnCommand('rsync', [
        args || '-av',
        from,
        to,
    ], options)
    return proc.promise
        .then(() => {
            return fullTo
        })
}

module.exports = rsync
