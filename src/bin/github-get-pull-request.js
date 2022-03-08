#!/usr/bin/env node
const _ = require('lodash');
const assert = require('assert');
const GitHub = require('@octokit/rest');

const repository = require('../lib/repository');

const pkg = require(`${process.cwd()}/package.json`);

if (process.argv.length < 3 || process.argv[2].length < 32) {
  console.error('no commit message');
  process.exit(1);
}

const COMMIT_SHA = process.argv[2];

const github = new GitHub();
assert(process.env.GITHUB_OAUTH_TOKEN, 'GITHUB_OAUTH_TOKEN env variable should contain your personal access token');
github.authenticate({ type: 'oauth', token: process.env.GITHUB_OAUTH_TOKEN });

const { user: owner, repo } = repository(pkg);

github.pullRequests
  .getAll({ owner, repo })
  .then(({ data }) => {
    const { number } = _.find(data, { head: { sha: COMMIT_SHA } });
    if (!number) {
      throw 'no results';
    }
    console.log(number);
  })
  .catch(() => {
    console.error(`cannot get pr for ${COMMIT_SHA}`);
    process.exit(1);
  });
