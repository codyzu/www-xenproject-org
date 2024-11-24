(() => {
  document.documentElement.classList.add("has-js");
  const selector = ".carousel-container";
  const itemsContainerSelector = ".carousel";
  const itemSelector = ".carousel-item";

  const { debounce, waitForElements } = window.XenSiteUtils;

  const carousel = async (element) => {
    const itemsContainer = element.querySelector(itemsContainerSelector);
    const items = await waitForElements(element, itemSelector);

    const firstItem = items[0].cloneNode(true);
    firstItem.innerHTML = "";
    firstItem.classList.add("carousel-item--clone");
    itemsContainer.prepend(firstItem);
    const lastItem = firstItem.cloneNode(true);
    itemsContainer.append(lastItem);

    element.querySelector(".carousel-button.prev").addEventListener("click", () => {
      itemsContainer.scrollBy({
        left: -firstItem.clientWidth,
        behavior: "smooth",
      });
    });

    element.querySelector(".carousel-button.next").addEventListener("click", () => {
      itemsContainer.scrollBy({
        left: firstItem.clientWidth,
        behavior: "smooth",
      });
    });

    function updateCarouselTabIndexes() {
      const items = element.querySelectorAll(".carousel-item");

      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const isVisible = rect.left >= 0 && rect.right <= window.innerWidth;

        item.classList.toggle("carousel-item--hidden", !isVisible);
        const links = item.querySelectorAll("a");

        links.forEach((link) => {
          if (link.getAttribute("aria-hidden") !== "true") {
            if (isVisible) {
              link.removeAttribute("tabindex");
            } else {
              link.setAttribute("tabindex", "-1");
            }
          }
        });
      });
    }

    element.querySelector(".carousel").addEventListener("scroll", updateCarouselTabIndexes);
    updateCarouselTabIndexes();
  };

  [...document.querySelectorAll(selector)].forEach((elm) => {
    carousel(elm);
  });
})();
