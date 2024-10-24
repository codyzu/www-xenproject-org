(() => {
  /**
   * Format a date to a specific format, default is "YYYY-MM-DD"
   * @param {string} date - The date to format
   * @param {string} format - The format to use
   * @returns {string} The formatted date
   */
  const formatDate = (date, format = "YYYY-MM-DD") => {
    const dateObj = new Date(date);
    return format.replace(/YYYY|MM|DD/g, (match) => {
      switch (match) {
        case "YYYY":
          return dateObj.getFullYear();
        case "MM":
          return (dateObj.getMonth() + 1).toString().padStart(2, "0");
        case "DD":
          return dateObj.getDate().toString().padStart(2, "0");
        default:
          return "";
      }
    });
  };

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  window.XenSiteUtils = {
    formatDate,
    debounce,
  };
})();
