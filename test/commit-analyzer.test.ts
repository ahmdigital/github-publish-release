import getVersionType from '../src/lib/commit-analyzer';
import * as getLastTag from '../src/lib/get-last-tag';
import * as getCommitHistory from '../src/lib/get-commit-history';

const stubGit = (commitType: string, anotherCommitType: string) => {
  const commitHistory = `44f026c Add eslintrc
      56c1d28 [${commitType}]: Add some fixes
      83ce07a Extract cmd
      94df78c [${anotherCommitType}]Update README.md
      0f23f08 Update README.md`;

  jest.spyOn(getCommitHistory, 'getCommitHistory').mockResolvedValue(commitHistory);
  jest.spyOn(getLastTag, 'getLastTag').mockResolvedValue('1.2.3');
};

beforeEach(() => {
  jest.resetAllMocks();
});

it.each(['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease', 'dev'])(
  'should return %s',
  async (commitType) => {
    stubGit(commitType, 'dev');
    const versionType = await getVersionType();
    expect(versionType).toEqual(commitType);
  },
);

it.each([
  {
    error: new Error(
      "Can't recognise the release type! Please make sure the repo follows the commit message standard.",
    ),
    key: '',
  },
  {
    error: new Error(
      "Can't recognise the release type! Please make sure the repo follows the commit message standard.",
    ),
    key: 'other',
  },
])('should throw an error for $key', async ({ key, error }) => {
  stubGit(key, key);
  const promise = getVersionType();
  await expect(promise).rejects.toThrow(error);
});
