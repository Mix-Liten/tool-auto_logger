const readline = require("readline");
const { log } = console;

const clearLine = (lineNum = 1) => {
  while (lineNum > 0) {
    readline.moveCursor(process.stdout, 0, -1);
    readline.clearLine(process.stdout, 1);
    lineNum--;
  }
};

module.exports = {
  log,
  clearLine,
};
