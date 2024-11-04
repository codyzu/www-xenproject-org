document.addEventListener("DOMContentLoaded", () => {
  // Vérifie si IntersectionObserver est supporté
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "-100px 0px",
      },
    );

    document.querySelectorAll("[data-animate]").forEach((element) => {
      observer.observe(element);
    });
  } else {
    // Fallback : ajoute directement la classe animate sur tous les éléments
    document.querySelectorAll("[data-animate]").forEach((element) => {
      element.classList.add("animate");
    });
  }
});
