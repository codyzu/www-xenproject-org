(() => {
  const mobileMenu = () => {
    const header = globalThis.document.querySelector('.header');
    const menuToggle = header.querySelector('.menu-toggle');

    menuToggle.addEventListener('click', (event) => {
      event.preventDefault();
      toggleMenu();
    });

    const toggleMenu = () => {
      header.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', String(header.classList.contains('active')));
      applyHeaderEvents();
    };

    const manageClick = (menu) => (event) => {
      const listItem = event.target.closest('li');
      if (event.target.matches('a') && listItem.parentElement === menu && event.target.target !== '_blank') {
        event.preventDefault();
        listItem.classList.toggle('active');
      }
    };

    const menu = header.querySelector('.header-nav .menu');
    const eventHandler = manageClick(menu);
    const applyHeaderEvents = () => {
      if (header.classList.contains('active')) {
        menu.addEventListener('click', eventHandler);
      } else {
        menu.removeEventListener('click', eventHandler);
      }
    };
  };

  const headerDesktopEvents = () => {
    const menu = globalThis.document.querySelector('.header .menu');
    if (!menu) return;
    const menuFirstLevelEventHandler = (event) => {
      const hasTouchCapability =
        'ontouchstart' in globalThis || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
      if (!hasTouchCapability) return;

      const listItem = event.target.closest('li');
      if (
        event.target.matches('a') &&
        listItem.parentElement === menu &&
        event.target.target !== '_blank' &&
        listItem.querySelector('ul')
      ) {
        event.preventDefault();
      }
    };

    const menuKeyboardHandler = (event) => {
      if (event.key === 'Enter') {
        const listItem = event.target.closest('li');
        if (listItem && listItem.parentElement === menu && listItem.querySelector('ul')) {
          event.preventDefault();
          listItem.classList.toggle('active');
        }
      } else if (event.key === 'Escape') {
        const activeMenus = menu.querySelectorAll('li.active');
        for (const activeMenu of activeMenus) {
          activeMenu.classList.remove('active');
        }
      }
    };

    menu.addEventListener('click', menuFirstLevelEventHandler);
    menu.addEventListener('keydown', menuKeyboardHandler);
  };

  const applyMenuEvents = () => {
    headerDesktopEvents();
    mobileMenu();
  };

  globalThis.applyMenuEvents = applyMenuEvents;
  globalThis.document.addEventListener('DOMContentLoaded', () => {
    applyMenuEvents();
  });
})();
