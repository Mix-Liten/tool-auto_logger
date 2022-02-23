const path = require("path");
const cron = require("node-cron");
const mainAPP = require("./main");
const systemDiffTimeout = require("./utils/systemDiffTimeout");
const formatDate = require("./utils/formatDate");
const { checkSchedule } = require("./utils/googleSheet");
const dotenvAbsolutePath = path.join(__dirname, "./.env");
require("dotenv").config({ path: dotenvAbsolutePath });

const config = {
  userid: process.env.userid,
  password: process.env.password,
  url: process.env.url,
  breakDay: ["日", "土"],
};

// 排程格式參考
// https://www.npmjs.com/package/cron#cron-ranges

const setCronHourAndMinute = (hour, minute) => {
  const [oriHour, oriMinute] = [
    parseInt(minute) - 30 > 0 ? parseInt(hour) : parseInt(hour) - 1,
    parseInt(minute) - 30 > 0 ? parseInt(minute) - 30 : parseInt(minute) + 30,
  ];
  const newMinute = oriMinute.toString().padStart(2, "0");
  const newHour = oriHour.toString().padStart(2, "0");

  return `${newMinute} ${newHour}`;
};

cron.schedule(
  `${setCronHourAndMinute(process.env.onHour, process.env.onMinute)} * * 1-6`,
  async () => {
    const today = formatDate("pureDay");
    const [isInSchedule, shouldWork] = await checkSchedule(today);
    const isBreakDay = config.breakDay.includes(formatDate("star"));
    if ((isInSchedule && !shouldWork) || (!isInSchedule && isBreakDay)) return;
    systemDiffTimeout(() => mainAPP(true, config));
  }
);

cron.schedule(
  `${setCronHourAndMinute(process.env.offHour, process.env.offMinute)} * * 1-6`,
  async () => {
    const today = formatDate("pureDay");
    const [isInSchedule, shouldWork] = await checkSchedule(today);
    const isBreakDay = config.breakDay.includes(formatDate("star"));
    if ((isInSchedule && !shouldWork) || (!isInSchedule && isBreakDay)) return;
    systemDiffTimeout(() => mainAPP(false, config));
  }
);

console.log("Auto logger start...");
