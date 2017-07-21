const util = require('util')
const debuglog = util.debuglog('wrote')
const spawnCommand = require('spawncommand')

/**
 * Run rmrf command to remove directory
 * @param {string} dirPath path to the directory to remove
 * @param {string} [args] arguments to pass, instead of '-rf', e.g., "-f"
 * @param {object} [options] Options to spawn child process with
 * @returns {Promise<string>} A promise resolved with the path to the removed dir
 */
function rmrf(dirPath, args, options) {
    if (!dirPath) {
        return Promise.reject(new Error('Please give path to directory'))
    }
    const proc = spawnCommand('rm', [
        args || '-rfv',
        dirPath,
    ], options)
    return proc.promise
        .then((res) => {
            res.stdout && debuglog('rmrf\n===\n', res.stdout, '===')
            return dirPath
        })
}

module.exports = rmrf
