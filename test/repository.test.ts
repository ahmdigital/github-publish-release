import repository from '../src/lib/repository';
const expected = { repo: 'bar', user: 'foo' };

it('should work when package.repository is defined and protocol is http(s)', () => {
  expect(repository({ repository: { url: 'https://github.com/foo/bar.git' } })).toEqual(expected);

  expect(repository({ repository: { url: 'git+https://github.com/foo/bar.git' } })).toEqual(expected);
});

it('should work when package.repository is defined and protocol is git', () => {
  expect(repository({ repository: { url: 'git@github.com:foo/bar.git' } })).toEqual(expected);
});

it('should work when package.homepage is only defined', () => {
  expect(repository({ homepage: 'https://github.com/foo/bar' })).toEqual(expected);
  expect(repository({ homepage: 'https://github.com/foo/bar#readme' })).toEqual(expected);
});

it('should work with dashed in repo name', () => {
  expect(repository({ repository: { url: 'https://github.com/foo/bar-baz.git' } })).toEqual({
    repo: 'bar-baz',
    user: 'foo',
  });
});
