(() => {
  document.documentElement.classList.add("has-js");
  const selectors = {
    container: ".carousel-container",
    itemsContainer: ".carousel",
    item: ".carousel-item",
  };

  const { waitForElements } = window.XenSiteUtils;

  const carousel = async (element) => {
    const itemsContainer = element.querySelector(selectors.itemsContainer);
    const items = await waitForElements(element, selectors.item);

    const cloneItem = items[0].cloneNode(true);
    cloneItem.innerHTML = "";
    cloneItem.classList.add("carousel-item--clone");

    itemsContainer.prepend(cloneItem.cloneNode(true));
    itemsContainer.append(cloneItem);

    let state = { isHovered: false, hasBeenFocused: false };

    const next = () => {
      itemsContainer.scrollBy({
        left: cloneItem.clientWidth,
        behavior: "smooth",
      });
    };

    const prev = () => {
      itemsContainer.scrollBy({
        left: -cloneItem.clientWidth,
        behavior: "smooth",
      });
    };

    element.addEventListener("mouseenter", () => (state.isHovered = true));
    element.addEventListener("mouseleave", () => (state.isHovered = false));
    element.addEventListener("focusin", () => (state.hasBeenFocused = true));
    element.addEventListener("focusout", () => (state.hasBeenFocused = false));

    const prevButton = element.querySelector(".prev");
    const nextButton = element.querySelector(".next");

    prevButton?.addEventListener("click", prev);
    nextButton?.addEventListener("click", next);

    document.addEventListener("keydown", ({ key }) => {
      if (state.hasBeenFocused || state.isHovered) {
        if (key === "ArrowLeft") prev();
        if (key === "ArrowRight") next();
      }
    });

    const updateCarouselTabIndexes = () => {
      element.querySelectorAll(".carousel-item").forEach((item) => {
        const { left, right } = item.getBoundingClientRect();
        const isVisible = left >= 0 && right <= window.innerWidth;

        item.classList.toggle("carousel-item--hidden", !isVisible);
        item.querySelectorAll("a").forEach((link) => {
          if (link.getAttribute("aria-hidden") !== "true") {
            link.toggleAttribute("tabindex", !isVisible);
            isVisible ? link.removeAttribute("tabindex") : link.setAttribute("tabindex", "-1");
          }
        });
      });
    };

    itemsContainer.addEventListener("scroll", updateCarouselTabIndexes);
    updateCarouselTabIndexes();
  };

  document.querySelectorAll(selectors.container).forEach(carousel);
})();
