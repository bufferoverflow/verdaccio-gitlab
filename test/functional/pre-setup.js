require('babel-polyfill');
require('babel-register');
const chalk = require('chalk');

module.exports = async () => {
  console.log(chalk.blue('setup: starting servers'));

  require('./lib/setup');
}

