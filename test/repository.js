const assert = require('assert');
const repository = require('../lib/repository');

describe('repository', () => {
  const expected = { user: 'foo', repo: 'bar' };

  it('should work when package.repository is defined and protocol is http(s)', () => {
    assert.deepEqual(repository({ repository: { url: 'https://github.com/foo/bar.git' } }), expected);
    assert.deepEqual(repository({ repository: { url: 'git+https://github.com/foo/bar.git' } }), expected);
  });

  it('should work when package.repository is defined and protocol is git', () => {
    assert.deepEqual(repository({ repository: { url: 'git@github.com:foo/bar.git' } }), expected);
  });

  it('should work when package.homepage is only defined', () => {
    assert.deepEqual(repository({ homepage: 'https://github.com/foo/bar' }), expected);
    assert.deepEqual(repository({ homepage: 'https://github.com/foo/bar#readme' }), expected);
  });
});
