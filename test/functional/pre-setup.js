require('@babel/register')({
  extensions: ['.ts', '.js'],
});
const chalk = require('chalk');

module.exports = async () => {
  console.log(chalk.blue('setup: starting servers'));

  require('./lib/setup');
};
