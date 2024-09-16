(() => {
  /** mobile only **/
  /** Menu events
   * the menuToggle button only appears on mobile, then
   * the menu is toggled on click on the menuToggle button
   * and the events are applied to the menu or removed when
   * the menu is toggled
   */
  const mobileMenu = () => {
    const header = document.querySelector(".header");
    const menuToggle = header.querySelector(".menu-toggle");

    menuToggle.addEventListener("click", (e) => {
      e.preventDefault();
      toggleMenu();
    });

    const toggleMenu = () => {
      header.classList.toggle("active");
      applyHeaderEvents();
    };

    const manageClick = (menu) => (e) => {
      const li = e.target.closest("li");
      if (e.target.matches("a") && li.parentElement === menu && e.target.target !== "_blank") {
        e.preventDefault();
        li.classList.toggle("active");
      }
    };

    const menu = header.querySelector(".header-nav .menu");
    let eventHandler = manageClick(menu);
    const applyHeaderEvents = () => {
      if (header.classList.contains("active")) {
        menu.addEventListener("click", eventHandler);
      } else {
        menu.removeEventListener("click", eventHandler);
      }
    };
  };
  mobileMenu();

  const menu = document.querySelector(".header .menu");
  let hasTouchCapability, hasMouseCapability;
  const menuFirstLevelEventHandler = (e) => {
    hasTouchCapability = "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    if (!hasTouchCapability) return;

    const li = e.target.closest("li");
    if (e.target.matches("a") && li.parentElement === menu && e.target.target !== "_blank" && li.querySelector("ul")) {
      e.preventDefault();
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    menu.addEventListener("click", menuFirstLevelEventHandler);
  });
})();
