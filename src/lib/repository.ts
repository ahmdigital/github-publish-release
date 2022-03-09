// this interface represents the fields
// from a package.json file that we need to use.
interface PackageJson {
  homepage?: string,
  repository?: {
    url?: string;
  }
}

export default function repository(pkg: PackageJson) {
  const repoUrl = (pkg.repository && pkg.repository.url) || pkg.homepage;
  if (!repoUrl) {
    throw new Error('Cannot detect repository name. Either `package.repository.url` or `package.homepage` should be set');
  }

  const parsed = repoUrl.match(/[/:]([a-z0-9-_]+)\/([a-z0-9-_]+)(\.git)?/i);
  return {
    repo: parsed![2],
    user: parsed![1],
  };
}
