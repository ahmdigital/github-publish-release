const assert = require('assert');
const url = require('url');

module.exports = (package) => {
  var repoUrl = (package.repository && package.repository.url) || package.homepage;
  assert(repoUrl, 'Cannot detect repository name. Either `package.repository.url` or `package.homepage` should be set');

  const parsed = repoUrl.match(/[\/:]([a-z0-9-_]+)\/([a-z0-9-_]+)(\.git)?/i);
  return {
    user: parsed[1],
    repo: parsed[2]
  };
};
