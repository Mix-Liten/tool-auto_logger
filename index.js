const path = require("path");
const cron = require("node-cron");
const browserLauncher = require("./utils/browserLauncher.js");
const dotenvAbsolutePath = path.join(__dirname, "./.env");
require("dotenv").config({ path: dotenvAbsolutePath });

const config = {
  userid: process.env.userid,
  password: process.env.password,
  url: "https://hrms.eztravel.com.tw/SCSWeb/Login.aspx",
};

function formatDate(type) {
  const date = new Date();

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const DD = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

  const formatDay = `${yyyy}/${MM}/${dd} (${DD})`;
  const formatTime = `${HH}:${mm}:${ss}`;
  const formatFull = `${formatDay} ${formatTime}`;
  switch (type) {
    case "day":
      return formatDay;
    case "time":
      return formatTime;
    case "full":
    default:
      return formatFull;
  }
}

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

cron.schedule("45 07 * * 1-5", () => {
  // console.log("start check on!");
  run(true);
});

cron.schedule("00 17 * * 1-5", () => {
  // console.log("start check off!");
  run(false);
});

console.log("Auto logger start...");
