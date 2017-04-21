const cmd = require('./cmd');

// For testing purposes
module.exports.getCommitHistory = (commitRange, cb) => cmd(`git log ${commitRange}`, cb);
module.exports.getLastTag = cb => cmd('git describe --tags --abbrev=0', cb);

/**
 * Analyzes all commits after last git tag and calls cb with one of
 * "major", "minor", "patch" as a second parameter or
 * ERROR_NO_CHANGES by default as first parameter.
 * Looks for [major], [minor] in commit history.
 *
 * @param cb - Callback.
 */
module.exports.getVersionType = (cb) => {
  let versionType;

  module.exports.getLastTag((lastTag) => {
        // Take the whole log when no tags found
    console.log('lastTag', lastTag);
    const commitRange = lastTag === '' ? '' : `${lastTag}..HEAD`;

    module.exports.getCommitHistory(commitRange, (commitHistory) => {
      if (commitHistory === '') {
        cb(new Error('No changes in git'));
        return;
      }
      console.log('commitHistory', commitHistory);
      ['major', 'minor', 'patch'].forEach((item) => {
        if (!versionType && RegExp(`\\[${item}\\]`).test(commitHistory)) {
          versionType = item;
        }
      });
      cb(null, versionType || 'minor');
    });
  });
};
