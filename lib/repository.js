const assert = require('assert');

module.exports = pkg => {
  const repoUrl = (pkg.repository && pkg.repository.url) || pkg.homepage;
  assert(repoUrl, 'Cannot detect repository name. Either `package.repository.url` or `package.homepage` should be set');

  const parsed = repoUrl.match(/[/:]([a-z0-9-_]+)\/([a-z0-9-_]+)(\.git)?/i);
  return {
    repo: parsed[2],
    user: parsed[1],
  };
};
