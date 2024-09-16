(() => {
  var selector = ".carousel-container";
  const itemsBefore = 2;
  const itemsAfter = 1;

  const carousel = (element) => {
    const carouselElement = element.querySelector(".carousel");

    const carouselClone = carouselElement.cloneNode(true);
    carouselClone.classList.add("carousel-clone");
    carouselClone.style.setProperty("position", "absolute");
    carouselClone.style.setProperty("left", "0");
    carouselClone.style.setProperty("top", "-100px");
    carouselClone.style.setProperty("width", "100%");
    carouselClone.style.setProperty("overflow", "hidden");
    carouselClone.style.setProperty("flex-wrap", "wrap");
    carouselClone.style.setProperty("pointer-events", "none");
    carouselClone.style.setProperty("visibility", "hidden");
    carouselClone.style.setProperty("height", "100");
    const getItemInformations = () => {
      carouselElement.before(carouselClone);
      carouselClone.style.setProperty("width", carouselElement.offsetWidth + "px");
      const items = carouselClone.querySelectorAll(".carousel-item");
      if (!items.length) return 0;
      const item2 = items[1];
      let occupiedSpace = item2.offsetLeft;

      if (occupiedSpace === 0 && item2.offsetTop > 0) occupiedSpace = item2.offsetWidth + 40;
      const width = item2.offsetWidth;
      const height = [...items].reduce((acc, item) => (acc < item.offsetHeight ? item.offsetHeight : acc), 0);
      carouselClone.remove();

      return {
        occupiedSpace,
        width,
        height,
      };
    };

    // element.classList.add("carousel-start-init");

    let prev = element.querySelector(".prev");
    let next = element.querySelector(".next");
    let items = element.querySelectorAll(".carousel-item");

    // add the clone the last item to the first place and for the first item to the last place
    // generic function to clone N last items to the first place and N first items to the last place

    const cloneItems = (items, clones) => {
      for (let i = 0; i <= clones; i++) {
        carouselElement.appendChild(items[i].cloneNode(true));
      }
    };
    cloneItems(items, itemsBefore);

    const cloneItemsReverse = (items, clones) => {
      for (let i = 0; i <= clones; i++) {
        carouselElement.prepend(items[items.length - 1 - i].cloneNode(true));
      }
    };

    cloneItemsReverse(items, itemsAfter);

    const moveNext = function () {
      let items = element.querySelectorAll(".carousel-item");
      carouselElement.appendChild(items[0]);
    };
    next.addEventListener("click", moveNext);

    const movePrev = function () {
      let items = element.querySelectorAll(".carousel-item");
      carouselElement.prepend(items[items.length - 1]);
    };
    prev.addEventListener("click", movePrev);

    // mobile
    let startX, moveX;

    carouselElement.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    carouselElement.addEventListener("touchend", (e) => {
      moveX = e.changedTouches[0].clientX - startX;
      if (Math.abs(moveX) > 50) {
        // Seuil de 50px pour considérer comme un swipe
        if (moveX > 0) {
          movePrev();
        } else {
          moveNext();
        }
      }
    });

    /** The rules are generated from the element width and container width
     *  The rules are :
     *  - nth-child(1) is opacity:0 and index -2
     *  - nth-child(2) is opacity:0 and index -1
     *  - nth-child(3) is opacity:1 and index 0
     *  - nth-child(4) is opacity:1 and index 1
     *  - ...
     *  - nth-child(maxItems) is opacity:1 and index maxItems - 1
     *
     */
    let styleTag;
    let lastWindowWidth = -1;
    const generateStyles = (element) => {
      const windowWidth = window.innerWidth;
      if (windowWidth === lastWindowWidth) return;
      lastWindowWidth = windowWidth;
      const rules = [];

      // add carousel styles generated from the element width
      if (!styleTag) {
        styleTag = document.createElement("style");
        document.head.appendChild(styleTag);
      }

      const { occupiedSpace, width: itemWidth, height } = getItemInformations();

      if (occupiedSpace < 100) {
        console.error("Error in the carousel, no item width detected");
        return;
      }

      rules.push(`
        .carousel-container {
          --item-width: ${itemWidth}px;
          --item-position: ${occupiedSpace}px;
          --height: ${height}px;
        }
      `);

      const itemsBefore = 3;
      const itemsAfter = 2;

      const carouselWidth = carouselElement.offsetWidth;
      const maxItems = Math.floor(carouselWidth / occupiedSpace) + 1 + itemsBefore + itemsAfter;

      let opacity = 0;
      for (let i = 1; i <= maxItems; i++) {
        if ((i >= itemsBefore && i < maxItems - itemsAfter) || i - itemsBefore === 0) {
          opacity = 1;
        } else if (i === maxItems - itemsAfter) {
          opacity = 0.2;
        } else {
          opacity = 0;
        }

        const index = i - itemsBefore;
        rules.push(`
          .carousel-item:nth-child(${i}) {
            --index: ${index};
            opacity: ${opacity}; 
            display: flex;
          }
        `);
      }

      styleTag.innerHTML = rules.join("\n");
    };

    const debounce = (func, delay) => {
      let timeoutId;
      return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
      };
    };

    window.addEventListener(
      "resize",
      debounce(() => {
        generateStyles(element);
      }, 50),
    );
    generateStyles(element);

    carouselElement.classList.add("carousel-initialized");
  };

  [...document.querySelectorAll(selector)].forEach((elm) => {
    carousel(elm);
  });
})();
