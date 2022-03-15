import { Octokit } from '@octokit/rest';

import repository, { PackageJson } from '../lib/repository';

async function main() {
  const pkg = import(`${process.cwd()}/package.json`) as PackageJson;

  const github = new Octokit();
  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }

  github.auth({ token: process.env.GITHUB_OAUTH_TOKEN, type: 'oauth' });

  const { user: owner, repo } = repository(pkg);

  const response = await github.repos.getLatestRelease({ owner, repo });
  if (response.status !== 200) {
    throw new Error(`status: ${response.status}, error details: ${response.data}`);
  }

  // eslint-disable-next-line no-console
  console.log(`Latest release: ${response.data.name}`);

  const prs = await github.pulls.list({ direction: 'desc', owner, repo, sort: 'updated', state: 'closed' });
  if (prs.status > 200) {
    throw new Error(`status: ${prs.status}, error details: ${prs.data}`);
  }

  // eslint-disable-next-line lodash/prefer-lodash-method
  const body = prs.data
    .filter((item) => item.merged_at! > response.data.published_at!)
    .sort((foo, bar) => bar.title.localeCompare(foo.title))
    .map((item) => `- ${item.title} #${item.number} (by @${item.user!.login})`)
    .join('\n');

  const name = `v${pkg.version}`;

  // eslint-disable-next-line no-console
  console.log(`Publishing release: ${name}`);

  // eslint-disable-next-line no-console
  console.log(body);

  await github.repos.createRelease({
    body,
    draft: false,
    name,
    owner,
    prerelease: false,
    repo,
    tag_name: name,
    target_commitish: 'master',
  });
}

if (require.main === module) {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
