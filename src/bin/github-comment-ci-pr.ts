#!/usr/bin/env bash
import { main as commentPullRequest } from './github-comment-pull-request';
import { main as getPullRequest } from './github-get-pull-request';
// echo "COMMIT: $1"
// TARGET_PR=`github-get-pull-request $1 2> \&1`
// if [ "$?" -ne 0 ] ; then
//   echo "Failed to create comment. $TARGET_PR"
//   exit 1
// fi
// echo "Commenting $TARGET_PR"
// github-comment-pull-request $TARGET_PR "$2"


async function main(argv: string[]) {
  console.log(`COMMIT: ${argv[0]}`);
  const targetPR = await getPullRequest([argv[0]]);
  if (!targetPR) {
    throw new Error('Failed to create find the target PR');
  }

  // eslint-disable-next-line no-console
  console.log(`Commenting ${targetPR}`)
  await commentPullRequest([targetPR.toString(), argv[1]]);
}

if (require.main === module) {
  main(process.argv).catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
