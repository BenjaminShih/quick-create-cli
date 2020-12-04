const log = require('./logger');

let line = [];
const NUM = 80;
for (let num = 0; num < NUM; num++) {
  line.push('=');
}
line = line.join('');
module.exports = function () {
  log(line);
};
