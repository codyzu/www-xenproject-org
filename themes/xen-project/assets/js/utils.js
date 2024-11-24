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

  /**
   * Waits for elements matching the selector to be present in the DOM within the given element.
   * @param {HTMLElement} element - The parent element to observe for the selector.
   * @param {string} selector - The CSS selector to match the elements.
   * @returns {Promise<NodeListOf<Element>>} A promise that resolves with the matched elements.
   */
  const waitForElements = (element, selector) => {
    return new Promise((resolve) => {
      const items = element.querySelectorAll(selector);
      if (items.length) {
        resolve(items);
        return;
      }

      const observer = new MutationObserver((mutations) => {
        const items = element.querySelectorAll(selector);
        if (items.length) {
          observer.disconnect();
          resolve(items);
        }
      });

      observer.observe(element, {
        childList: true,
        subtree: true,
      });
    });
  };

  window.XenSiteUtils = {
    formatDate,
    debounce,
    waitForElements,
  };
})();
