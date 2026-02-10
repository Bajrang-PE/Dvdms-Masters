export function parseDate(value) {

  const date = value instanceof Date ? value : new Date(value);

  if (isNaN(date.getTime())) {
    console.error("Invalid date value:", value);
    return "Invalid-Date";
  }

  const day = String(date.getDate()).padStart(2, "0");

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return `${day}-${month}-${year}`;
}

export function isISODateString(value) {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?([+-]\d{2}:\d{2}|Z)$/.test(
      value
    )
  );
}
