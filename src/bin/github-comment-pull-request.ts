#!/usr/bin/env node

import { Octokit } from '@octokit/rest';
import { number } from '../lib/parsing';
import repository from '../lib/repository';

export async function main(argv: string[]) {
  const pkg = require(`${process.cwd()}/package.json`);

  if (process.argv.length < 4) {
    throw new Error('usage: npm run github-comment-pull-request <pull-request-number> <message>');
  }

  const PULL_REQUEST_ID = number(argv[2]);

  const COMMENT_BODY = argv[3];

  const github = new Octokit();

  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }

  github.auth({ type: 'oauth', token: process.env.GITHUB_OAUTH_TOKEN });

  const { user: owner, repo } = repository(pkg);

  await github.pulls.createReview({
    body: COMMENT_BODY,
    event: 'COMMENT',
    pull_number: PULL_REQUEST_ID,
    owner,
    repo,
  });
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}