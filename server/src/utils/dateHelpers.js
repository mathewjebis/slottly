/** Parse YYYY-MM-DD as UTC midnight so queries match MongoDB Date storage. */
const parseDateUTC = (dateString) => {
  const cleanStr = String(dateString).slice(0, 10);
  const [year, month, day] = cleanStr.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
};

/** Day-of-week abbreviation for a YYYY-MM-DD string (UTC). */
const getDayOfWeekUTC = (dateString) => {
  const date = parseDateUTC(dateString);
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return dayNames[date.getUTCDay()];
};

/** Inclusive UTC day range for time-off / appointment day matching. */
const getUTCDayRange = (dateString) => {
  const start = parseDateUTC(dateString);
  const end = new Date(start);
  end.setUTCHours(23, 59, 59, 999);
  return { start, end };
};

module.exports = { parseDateUTC, getDayOfWeekUTC, getUTCDayRange };
