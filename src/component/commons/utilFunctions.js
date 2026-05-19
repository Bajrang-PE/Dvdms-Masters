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

export const getValueInsideBrackets = (str) =>
  str.match(/\(([^)]+)\)/)?.[1] || "";


export const convertToISODate = (dateStr) => {

  if (!dateStr) return "";
  const months = {
    JAN: "01", FEB: "02", MAR: "03", APR: "04", MAY: "05", JUN: "06",
    JUL: "07", AUG: "08", SEP: "09", OCT: "10", NOV: "11", DEC: "12"
  };

  const [day, month, year] = dateStr.split("-");
  const formattedYear = year?.length === 2 ? `20${year}` : year;
  const formattedMonth = months[month?.toUpperCase()];

  return `${formattedYear}-${formattedMonth}-${day}`;
};
