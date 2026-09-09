/** Local calendar date as YYYY-MM-DD (avoids UTC shift from toISOString). */
export const toLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/** Format a date string (YYYY-MM-DD or ISO) for display without timezone drift. */
export const formatDisplayDate = (dateStr, options = {}) => {
  if (!dateStr) return "";
  const raw = String(dateStr).slice(0, 10);
  const [y, m, d] = raw.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

export const formatDuration = (minutes) => {
  if (minutes < 60) return `${minutes} min`;
  const hours = minutes / 60;
  const display = hours % 1 === 0 ? hours : hours.toFixed(1);
  return `${display} hr${hours === 1 ? "" : "s"}`;
};

export const statusStyles = {
  pending: "bg-amber-50 text-amber-800 border-amber-200",
  confirmed: "bg-teal-50 text-teal-800 border-teal-200",
  completed: "bg-slate-100 text-slate-700 border-slate-200",
  cancelled: "bg-rose-50 text-rose-700 border-rose-200",
};
