#!/usr/bin/env node
import got from 'got';

import { Octokit } from '@octokit/rest';

import repository, { PackageJson } from '../lib/repository';

async function main() {
  // eslint-disable-next-line
  const pkg = require(`${process.cwd()}/package.json`) as PackageJson;

  const github = new Octokit({ auth: process.env.GITHUB_OAUTH_TOKEN });
  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }

  const { user: owner, repo } = repository(pkg);

  try {
    const response = await github.repos.getLatestRelease({ owner, repo });
    if (response.status !== 200) {
      if (response.status === 404) {
        throw new Error(
          `status:${response.status}, no latest release of ${repo} has been found, please do a manual release on github.`,
        );
      }
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
  } catch (error) {
    // send a slack message to the delivery channel
    const slackWebhookURL = 'https://hooks.slack.com/services/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';
    const payload = `{"channel": "#digital-delivery","username": "github-publish-release","text": "Repo: ${repo} release failed on error: ${error}. @${owner}","icon_emoji": ":github:"}`;
    got.post(slackWebhookURL, { json: JSON.parse(payload) });
    throw error;
  }
}

if (require.main === module) {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
