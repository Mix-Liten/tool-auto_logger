function formatDate(type) {
  const date = new Date();

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, "0"); // month is zero-based
  const dd = String(date.getDate()).padStart(2, "0");
  const HH = String(date.getHours()).padStart(2, "0");
  const mm = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");
  const DD = ["日", "月", "火", "水", "木", "金", "土"][date.getDay()];

  const formatPureDay = `${yyyy}/${MM}/${dd}`;
  const formatDay = `${yyyy}/${MM}/${dd} (${DD})`;
  const formatTime = `${HH}:${mm}:${ss}`;
  const formatFull = `${formatDay} ${formatTime}`;
  switch (type) {
    case "day":
      return formatDay;
    case "pureDay":
      return formatPureDay;
    case "star":
      return DD;
    case "time":
      return formatTime;
    case "full":
    default:
      return formatFull;
  }
}

module.exports = formatDate;
