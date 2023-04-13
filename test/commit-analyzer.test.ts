import _ from 'lodash';
import getVersionType from '../src/lib/commit-analyzer';
import * as getLastTag from '../src/lib/get-last-tag';
import * as getCommitHistory from '../src/lib/get-commit-history';

const stubGit = (commitType: string) => {
  const commitHistory = `44f026c Add eslintrc
      56c1d28 [${commitType}]: Add some fixes
      83ce07a Extract cmd
      94df78c [${commitType}]Update README.md
      0f23f08 Update README.md`;

  jest.spyOn(getCommitHistory, 'getCommitHistory').mockResolvedValue(commitHistory);
  jest.spyOn(getLastTag, 'getLastTag').mockResolvedValue('1.2.3');
};

beforeEach(() => {
  jest.resetAllMocks();
});

_.forOwn(
  {
    major: 'major',
    minor: 'minor',
    patch: 'patch',
  },
  (resultType, commitType) => {
    it(`should return ${resultType}`, async () => {
      stubGit(commitType);
      const versionType = await getVersionType();
      expect(versionType).toEqual(resultType);
    });
  },
);

_.forOwn(
  {
    '': new Error("Can't recognise the release type! Please make sure the repo follows the commit message standard."),
    other: new Error(
      "Can't recognise the release type! Please make sure the repo follows the commit message standard.",
    ),
  },
  (error, commitType) => {
    it(`should throw an error for ${commitType}`, async () => {
      stubGit(commitType);
      const promise = getVersionType();
      await expect(promise).rejects.toThrow(error);
    });
  },
);
