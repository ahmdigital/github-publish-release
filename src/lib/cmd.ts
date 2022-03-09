import _ from 'lodash';
import { exec } from 'child_process';

export type CmdCallback = (stdout: string) => any;

export default function cmd(cmd: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(cmd, (err, stdout) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(_.split(stdout, '\n').join(''));
      }
    });
  });
}
