#!/usr/bin/env node
/* eslint-disable import/prefer-default-export */
import _ from 'lodash';
import { Octokit } from '@octokit/rest';
import repository, { PackageJson } from '../lib/repository';

// eslint-disable-next-line no-unused-vars
export async function main(argv: string[]) {
  const pkg = import(`${process.cwd()}/package.json`);

  if (process.argv.length < 3 || process.argv[2].length < 32) {
    throw new Error('no commit message');
  }

  const COMMIT_SHA = process.argv[2];

  const github = new Octokit();
  if (!process.env.GITHUB_OAUTH_TOKEN) {
    throw new Error('GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
  }
  github.auth({ token: process.env.GITHUB_OAUTH_TOKEN, type: 'oauth' });

  const { user: owner, repo } = repository(pkg as PackageJson);

  const prs = await github.pulls.list({ owner, repo });

  if (prs.status !== 200) {
    throw new Error(`cannot get pr for ${COMMIT_SHA}`);
  }

  const foundPR = _.find(prs.data, { head: { sha: COMMIT_SHA } });

  if (!foundPR) {
    throw new Error('no results');
  }

  return foundPR.id;
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
