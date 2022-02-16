const path = require("path");
const cron = require("node-cron");
const browserLauncher = require("./utils/browserLauncher.js");
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

const run = async (isOn) => {
  if (isOn) {
    console.log(`-------${formatDate("day")}-------`);
  }
  try {
    const browser = await browserLauncher({ headless: true });
    const page = (await browser.pages())[0];
    await page.goto(config.url);

    const loginDom = {
      userid: "#edtUserID_I",
      password: "#edtPassword_I",
      submitBtn: "#btnLogin_CD",
    };

    const checkerDom = {
      listFrame: 'iframe[name="ErpFrameMenu"]',
      checker: "#treeView_N0_0_0_7",
      mainFrame: "iframe#FrameMain",
      onlineBtn: "#btnOnSwipe_CD",
      offlineBtn: "#btnOffSwipe_CD",
    };

    // console.log("open page...");

    await page.type(loginDom.userid, config.userid);
    await page.type(loginDom.password, config.password);
    await page.click(loginDom.submitBtn);
    await page.waitForNavigation();

    // console.log("navigation...");

    const listFrameEleHandle = await page.waitForSelector(checkerDom.listFrame);
    const listFrameEle = await listFrameEleHandle.contentFrame();
    await listFrameEle.click(checkerDom.checker);

    // console.log("to checker...");

    await page.waitForTimeout(2000);

    const mainFrameEleHandle = await page.waitForSelector(checkerDom.mainFrame);
    const mainFrameEle = await mainFrameEleHandle.contentFrame();
    if (isOn) {
      // console.log("will log on!");
      await mainFrameEle.click(checkerDom.onlineBtn);
      console.log(`↳ ${formatDate("time")} 上班打卡結束!`);
    } else {
      // console.log("will log off!");
      await mainFrameEle.click(checkerDom.offlineBtn);
      console.log(`↳ ${formatDate("time")} 下班打卡結束!`);
    }

    // console.log("finish check...");
    await page.waitForTimeout(2000);

    await browser.close();
  } catch (error) {
    console.log("error", error);
  }
};

// 排程格式參考
// https://www.npmjs.com/package/cron#cron-ranges

// cron.schedule("45 07 * * 1-5", () => {
//   run(true);
// });

// cron.schedule("05 17 * * 1-5", () => {
//   run(false);
// });

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
    systemDiffTimeout(() => run(true));
  }
);

cron.schedule(
  `${setCronHourAndMinute(process.env.offHour, process.env.offMinute)} * * 1-6`,
  async () => {
    const today = formatDate("pureDay");
    const [isInSchedule, shouldWork] = await checkSchedule(today);
    const isBreakDay = config.breakDay.includes(formatDate("star"));
    if ((isInSchedule && !shouldWork) || (!isInSchedule && isBreakDay)) return;
    systemDiffTimeout(() => run(false));
  }
);

console.log("Auto logger start...");
