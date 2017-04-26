const { exec } = require('child_process');

module.exports = (cmd, cb) => exec(cmd, (err, stdout) => {
  if (err !== null) {
    console.error(err);
  }
  return cb(stdout.split('\n').join(''));
});
