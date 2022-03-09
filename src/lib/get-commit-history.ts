import cmd from "./cmd";

export async function getCommitHistory(commitRange: string) {
  return await cmd(`git log ${commitRange}`);
};
