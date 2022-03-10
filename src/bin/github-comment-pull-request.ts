#!/usr/bin/env node
/* eslint-disable import/prefer-default-export */

import { Octokit } from '@octokit/rest';
import number from '../lib/parsing';
import repository, { PackageJson } from '../lib/repository';

export async function main(argv: string[]) {
  const pkg = import(`${process.cwd()}/package.json`);

  if (process.argv.length < 4) {
    throw new Error('usage: npm run github-comment-pull-request <pull-request-number> <message>');
  }

  const PULL_REQUEST_ID = number(argv[2]);

  const COMMENT_BODY = argv[3];

  const github = new Octokit();

  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }

  github.auth({ token: process.env.GITHUB_OAUTH_TOKEN, type: 'oauth' });

  const { user: owner, repo } = repository(pkg as PackageJson);

  await github.pulls.createReview({
    body: COMMENT_BODY,
    event: 'COMMENT',
    owner,
    pull_number: PULL_REQUEST_ID,
    repo,
  });

  // eslint-disable-next-line no-console
  console.log('done');
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
