const path = require("path");
const puppeteer = require("puppeteer");

const isPkg = typeof process.pkg !== "undefined";
const chromiumExecutablePath = isPkg
  ? puppeteer.executablePath().replace(
      /^.*?\\node_modules\\puppeteer\\\.local-chromium/, //<------ That is for windows users, for linux users use:  /^.*?\/node_modules\/puppeteer\/\.local-chromium/
      path.join(path.dirname(process.execPath), ".local-chromium") //<------ Folder name, use whatever you want
    )
  : puppeteer.executablePath();

async function browserLauncher({ headless = true }) {
  const browser = await puppeteer.launch({
    executablePath: chromiumExecutablePath,
    headless, // headless: false -> 開啟模擬瀏覽器，headless: true -> 背景執行
    // args: ["--start-maximized"],
    // defaultViewport: null,
  });
  return browser;
}

module.exports = browserLauncher;
