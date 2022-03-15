#!/usr/bin/env node

import getVersionType from '../lib/commit-analyzer';

async function main() {
  const versionType = await getVersionType();
  process.stdout.write(versionType);
}

if (require.main === module) {
  main().catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
