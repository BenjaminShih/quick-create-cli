const chalk = require('chalk');
const figlet = require('figlet');
const log = require('./logger');

module.exports = function banner() {
  log(
    chalk.green(
      figlet.textSync('QG---Shi Junnan', {
        horizontalLayout: 'full',
      })
    )
  );
};
