const { GoogleSpreadsheet } = require("google-spreadsheet");

// https://ithelp.ithome.com.tw/articles/10234325
// https://www.npmjs.com/package/google-spreadsheet

/**
 * ID位置參考，https://docs.google.com/spreadsheets/d/<docID>/edit#gid=<sheetID>
 * @param  {String} docID the document ID
 * @param  {String} private_key the credentials GOOGLE_PRIVATE_KEY
 * @param  {String} client_email the credentials GOOGLE_SERVICE_ACCOUNT_EMAIL
 */
async function getSchedule(docID, private_key, client_email) {
  const result = [];
  try {
    const doc = new GoogleSpreadsheet(docID);
    await doc.useServiceAccountAuth({ private_key, client_email });
    await doc.loadInfo();
    // const sheet = doc.sheetsById[sheetID];
    const sheet = doc.sheetsByIndex[0];
    const rows = await sheet.getRows({ offset: 0 });
    for (let row of rows) {
      result.push(row._rawData);
    }
  } catch (error) {
    // console.log("error", error);
  }
  return result;
}

async function checkSchedule(dayStr) {
  const res = await getSchedule(
    process.env.docID,
    process.env.GOOGLE_PRIVATE_KEY,
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  );
  const inScheduleConfig = res.find((arrangement) => arrangement[0] === dayStr);
  if (inScheduleConfig) return [true, !!inScheduleConfig[1]];
  return [false];
}

module.exports = {
  getSchedule,
  checkSchedule,
};
