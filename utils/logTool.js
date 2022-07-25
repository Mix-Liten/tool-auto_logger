const readline = require("readline");
const { log } = console;

const clearLine = (lineNum = 1) => {
  readline.moveCursor(process.stdout, 0, -1 * lineNum);
  readline.clearLine(process.stdout, lineNum);
};

module.exports = {
  log,
  clearLine,
};
