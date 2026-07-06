const chalk = require("chalk");

module.exports = {
  info(message) {
    console.log(chalk.cyan("[INFO]"), message);
  },

  success(message) {
    console.log(chalk.green("[SUCCESS]"), message);
  },

  warn(message) {
    console.log(chalk.yellow("[WARN]"), message);
  },

  error(message) {
    console.log(chalk.red("[ERROR]"), message);
  },
};
