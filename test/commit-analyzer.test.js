const _ = require('lodash');
const sinon = require('sinon');

const commitAnalyzer = require('../lib/commit-analyzer');

let sandbox;

const stubGit = commitType => {
  const commitHistory = `44f026c Add eslintrc
      56c1d28 [${commitType}]: Add some fixes
      83ce07a Extract cmd
      94df78c [${commitType}]Update README.md
      0f23f08 Update README.md`;
  sandbox.stub(commitAnalyzer, 'getCommitHistory').callsFake((commitRange, cb) => cb(commitHistory));
  sandbox.stub(commitAnalyzer, 'getLastTag').callsFake(cb => cb('1.2.3'));
};

beforeEach(() => {
  sandbox = sinon.createSandbox();
});

afterEach(() => {
  sandbox.restore();
});
_.forOwn(
  {
    '': undefined,
    major: 'major',
    minor: 'minor',
    other: undefined,
    patch: 'patch',
  },
  (resultType, commitType) => {
    it(`should call cb with ${resultType}`, () =>
      new Promise(done => {
        stubGit(commitType);
        commitAnalyzer.getVersionType((err, versionType) => {
          expect(versionType).toEqual(resultType);
          done();
        });
      }));
  },
);
