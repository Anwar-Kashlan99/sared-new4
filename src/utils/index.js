export const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num;
};

export const searchDefinition = (text) => {
  const query = `define ${text}`;
  const url = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
  window.open(url, "_blank");
};

// Convert the UTC date to local timezone
const convertToLocalTime = (dateString) => {
  const inputDate = new Date(dateString);
  const localDate = new Date(
    inputDate.getTime() - inputDate.getTimezoneOffset() * 60000
  );
  return localDate;
};

export const formatDate = (dateString) => {
  const inputDate = convertToLocalTime(dateString); // Convert to local time
  const now = new Date();
  const differenceInSeconds = Math.floor((now - inputDate) / 1000);

  const units = [
    { name: "year", seconds: 60 * 60 * 24 * 365 },
    { name: "month", seconds: 60 * 60 * 24 * 30 },
    { name: "week", seconds: 60 * 60 * 24 * 7 },
    { name: "day", seconds: 60 * 60 * 24 },
    { name: "hour", seconds: 60 * 60 },
    { name: "minute", seconds: 60 },
  ];

  for (const unit of units) {
    const unitValue = Math.floor(differenceInSeconds / unit.seconds);
    if (unitValue >= 1) {
      return unitValue === 1
        ? `1 ${unit.name} ago`
        : `${unitValue} ${unit.name}s ago`;
    }
  }

  return "just now";
};

// For dates older than a year, return the YYYY-MM-DD format
export const formatDateWithYear = (dateString) => {
  const inputDate = convertToLocalTime(dateString); // Convert to local time
  const now = new Date();
  const differenceInYears = now.getFullYear() - inputDate.getFullYear();

  if (differenceInYears >= 1) {
    return inputDate.toISOString().split("T")[0]; // Output in YYYY-MM-DD format
  }

  return formatDate(dateString); // Use the "time ago" format for recent dates
};
