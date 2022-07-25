const browserLauncher = require("./utils/browserLauncher.js");
const formatDate = require("./utils/formatDate");
const { log, clearLine } = require("./utils/logTool");

const main = async (isOn, config, options) => {
  if (options?.retryTime && options?.retryTime > 3) {
    log(
      "Is already retry three time. The tool may breaked, please connect author or create an issue."
    );
    return;
  }
  if (isOn && !options?.isRetry) {
    clearLine(3);
    log(`-------${formatDate("day")}-------`);
  }
  let browser;
  try {
    browser = await browserLauncher({ headless: true });
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

    // login page - type & send form post
    await page.type(loginDom.userid, config.userid);
    await page.type(loginDom.password, config.password);
    await Promise.all([
      page.waitForNavigation(),
      await page.click(loginDom.submitBtn),
    ]);

    // index page - wait for sidebar iframe render then goto logger page
    const listFrameEleHandle = await page.waitForSelector(checkerDom.listFrame);
    const listFrameEle = await listFrameEleHandle.contentFrame();
    await listFrameEle.click(checkerDom.checker);

    // for sure the page render and dom can interactive
    await page.waitForTimeout(2e3);

    // logger page - wait for main iframe render then click logOn/logOff button
    const mainFrameEleHandle = await page.waitForSelector(checkerDom.mainFrame);
    const mainFrameEle = await mainFrameEleHandle.contentFrame();
    if (isOn) {
      await mainFrameEle.click(checkerDom.onlineBtn);
      log(`-> ${formatDate("time")} 上班打卡結束!`);
    } else {
      await mainFrameEle.click(checkerDom.offlineBtn);
      log(`-> ${formatDate("time")} 下班打卡結束!`);
    }

    // wait message about logged time, before close browser
    await page.waitForTimeout(2e3);

    await browser.close();
  } catch (error) {
    log("main error: ", error);
    await browser.close();
    setTimeout(() => {
      main(isOn, config, {
        isRetry: true,
        retryTime: (options?.retryTime || 0) + 1,
      });
    }, 1e3);
  }
};

module.exports = main;
