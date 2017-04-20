const { exec } = require('child_process');

const cmd = (cmd, cb) => exec(cmd, { cwd: __dirname }, (err, stdout) => cb(stdout.split('\n').join('')));

/**
 * Analyzes all commits after last git tag and calls cb with one of
 * "major", "minor", "patch" as a second parameter or
 * ERROR_NO_CHANGES by default as first parameter.
 * Looks for [major], [minor] in commit history.
 *
 * @param cb - Callback.
 */
module.exports = (cb) => {
    let versionType;

    cmd('git describe --tags --abbrev=0', (lastTag) => {
        // Take the whole log when no tags found
        console.log('lastTag',lastTag);
        const commitRange = lastTag === '' ? '' : `${lastTag}..HEAD`;

        cmd(`git log ${commitRange}`, (commitHistory) => {
            if(commitHistory === '') {
                return cb(new Error('No changes in git'));
            }
            ['major', 'minor', 'patch'].forEach((item) => {
                if(!versionType && RegExp(`[${item}]`).test(commitHistory)) {
                    versionType = item;
                }
            });
            cb(null, versionType || 'minor');
        });
    });
};
