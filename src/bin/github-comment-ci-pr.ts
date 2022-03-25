#!/usr/bin/env node
import { main as commentPullRequest } from './github-comment-pull-request';
import { main as getPullRequest } from './github-get-pull-request';

async function main(argv: string[]) {
  // eslint-disable-next-line no-console
  console.log(`COMMIT: ${argv[1]}`);
  const targetPR = await getPullRequest([argv[1]]);
  if (!targetPR) {
    throw new Error('Failed to create find the target PR');
  }

  // eslint-disable-next-line no-console
  console.log(`Commenting ${targetPR}`);
  await commentPullRequest([targetPR.toString(), argv[2]]);
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    // eslint-disable-next-line no-console
    console.error(error);
    process.exit(1);
  });
}
