#!/usr/bin/env node
import _ from 'lodash';
import { Octokit } from '@octokit/rest';
import repository from '../lib/repository';

export async function main(argv: string[]) {
  const pkg = require(`${process.cwd()}/package.json`);

  if (process.argv.length < 3 || process.argv[2].length < 32) {
    throw new Error('no commit message');
  }

  const COMMIT_SHA = process.argv[2];

  const github = new Octokit();
  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }
  github.auth({ type: 'oauth', token: process.env.GITHUB_OAUTH_TOKEN });

  const { user: owner, repo } = repository(pkg);

  const prs = await github.pulls.list({ owner, repo });

  if (prs.status !== 200) {
    throw new Error(`cannot get pr for ${COMMIT_SHA}`);
  }

  const foundPR =_.find(prs.data, { head: { sha: COMMIT_SHA } });

  if (!foundPR) {
    throw new Error('no results');
  }

  return foundPR.id;
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
