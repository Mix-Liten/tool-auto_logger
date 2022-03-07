const browserLauncher = require("./utils/browserLauncher.js");
const formatDate = require("./utils/formatDate");

const main = async (isOn, config, options) => {
  if (options?.retryTime && options?.retryTime > 3) {
    console.log(
      "Is already retry three time. The tool may breaked, please connect author or create an issue."
    );
    return;
  }
  if (isOn && !options?.isRetry) {
    console.log(`-------${formatDate("day")}-------`);
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

    await page.type(loginDom.userid, config.userid);
    await page.type(loginDom.password, config.password);
    await Promise.all([
      page.waitForNavigation(),
      await page.click(loginDom.submitBtn),
    ]);

    const listFrameEleHandle = await page.waitForSelector(checkerDom.listFrame);
    const listFrameEle = await listFrameEleHandle.contentFrame();
    await listFrameEle.click(checkerDom.checker);

    await page.waitForTimeout(2000);

    const mainFrameEleHandle = await page.waitForSelector(checkerDom.mainFrame);
    const mainFrameEle = await mainFrameEleHandle.contentFrame();
    if (isOn) {
      await mainFrameEle.click(checkerDom.onlineBtn);
      console.log(`↳ ${formatDate("time")} 上班打卡結束!`);
    } else {
      await mainFrameEle.click(checkerDom.offlineBtn);
      console.log(`↳ ${formatDate("time")} 下班打卡結束!`);
    }

    await page.waitForTimeout(2000);

    await browser.close();
  } catch (error) {
    console.log("error", error);
    await browser.close();
    setTimeout(() => {
      main(isOn, config, {
        isRetry: true,
        retryTime: (options?.retryTime || 0) + 1,
      });
    }, 1000);
  }
};

module.exports = main;
