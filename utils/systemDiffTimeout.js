const axios = require("axios");

/**
 * 有鑑於公司電腦的系統時間時不時會跑掉，特此寫個方法以在正確時間做事
 * @param {Function} fn
 */
async function diffAction(fn = () => {}) {
  const timeApiURL = "https://worldtimeapi.org/api/timezone/Asia/Taipei";
  const { data: timeJson } = await axios(timeApiURL);
  const { datetime } = timeJson;
  const [systemDate, realDate] = [new Date(), new Date(datetime)];

  // 系統時間較快會是 truthy，快要增加等待時間，反之則減少
  const type = systemDate - realDate > 0 ? 1 : -1;
  // 差異分鐘數
  const diff = Number((Math.abs(systemDate - realDate) / 6e4).toFixed(2));
  // **提早半小時**
  const preDiff = 30;
  // **亂數浮動四分鐘**
  const randomSeed = Math.floor(Math.random() * 4) + 1;
  // 計算 提前量 + 亂數量 + (快 -> 增加差異量 | 慢 -> 減少差異量)
  // 單位從分鐘轉換為秒
  const diffTime = (preDiff + randomSeed + type * diff) * 6e4;

  if (diff > 0) {
    console.log(`--系統時間比實際時間 ${type > 0 ? "快" : "慢"} ${diff}分鐘--`);
  }

  setTimeout(() => {
    fn();
  }, diffTime);
}

module.exports = diffAction;
