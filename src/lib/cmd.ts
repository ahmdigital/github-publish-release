import _ from 'lodash';
import { exec } from 'child_process';

export default function cmd(command: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err !== null) {
        reject(err);
      } else {
        resolve(_.split(stdout, '\n').join(''));
      }
    });
  });
}
