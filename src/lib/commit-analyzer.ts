import { find, includes } from 'lodash/fp';
import { getCommitHistory } from './get-commit-history';
import { getLastTag } from './get-last-tag';

/**
 * Analyses all commits after last git tag and calls cb with one of
 * "major", "minor", "patch" as a second parameter or ERROR_NO_CHANGES by default as first parameter.
 * Looks for [major], [minor] in commit history.
 *
 */
export default async function getVersionType() {
  const lastTag = await getLastTag();

  // Take the whole log when no tags found
  const commitRange = lastTag === '' ? '' : `${lastTag}..HEAD`;

  const commitHistory = await getCommitHistory(commitRange);
  if (commitHistory === '') {
    throw new Error('No changes in git');
  }

  // find the first item from the commit history matching the release type
  const versionType = find(
    (item) => includes(`[${item}]`, commitHistory),
    ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease', 'dev'],
  );

  if (!versionType) {
    throw new Error("Can't recognise the release type! Please make sure the repo follows the commit message standard.");
  }

  return versionType;
}
