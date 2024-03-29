#!/usr/bin/env node
/* eslint-disable import/prefer-default-export */

import { Octokit } from '@octokit/rest';
import number from '../lib/parsing';
import repository, { PackageJson } from '../lib/repository';

export async function main(argv: string[]) {
  // eslint-disable-next-line
  const pkg = require(`${process.cwd()}/package.json`) as PackageJson;

  if (process.argv.length < 4) {
    throw new Error('usage: npm run github-comment-pull-request <pull-request-number> <message>');
  }

  const PULL_REQUEST_ID = number(argv[2]);

  const COMMENT_BODY = argv[3];

  const github = new Octokit({ auth: process.env.GITHUB_OAUTH_TOKEN });

  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }

  const { user: owner, repo } = repository(pkg);

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
