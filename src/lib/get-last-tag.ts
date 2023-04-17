/* eslint-disable import/prefer-default-export */
import cmd from './cmd';

export async function getLastTag(): Promise<string> {
  return await cmd('git describe --tags `git rev-list --tags --max-count=1`');
}
