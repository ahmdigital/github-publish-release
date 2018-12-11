const _ = require("lodash");
const { exec } = require("child_process");

module.exports = (cmd, cb) =>
  exec(cmd, (err, stdout) => {
    if (err !== null) {
      // eslint-disable-next-line no-console
      console.error(err);
    }
    return cb(_.split(stdout, "\n").join(""));
  });
