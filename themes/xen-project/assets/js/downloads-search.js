(() => {
  const selector = ".download-search";

  const downloadsSearch = (element) => {
    const { debounce } = window.XenSiteUtils;
    let downloadsData = null;
    let resultsContainer;

    const loadDownloadsData = async () => {
      if (downloadsData === null) {
        try {
          const response = await fetch("/data/downloads.json");
          const data = await response.json();

          // Optimize data processing
          downloadsData = data.flatMap((group) =>
            group.versions.map((version) => ({
              ...version,
              groupName: group.name,
              versionName: version.name,
              searchTerms: `${group.name} ${version.name}`.toLowerCase(),
            })),
          );
        } catch (error) {
          console.error("Error loading downloads data:", error);
        }
      }
      return downloadsData;
    };

    const filterDownloads = (searchTerm) => {
      if (!downloadsData) return [];

      const searchTerms = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
      const numericTerm = searchTerms.find((term) => /^\d/.test(term));

      return Object.values(
        downloadsData
          .filter((item) => {
            const itemTerms = item.searchTerms.split(" ");
            return searchTerms.every((term) => {
              if (term === numericTerm) {
                const matchingItemTerm = itemTerms.find((itemTerm) => itemTerm.startsWith(term));
                return matchingItemTerm && matchingItemTerm.startsWith(term);
              }
              return item.searchTerms.includes(term);
            });
          })
          .reduce((acc, item) => {
            if (!acc[item.groupName]) {
              acc[item.groupName] = { name: item.groupName, versions: [] };
            }
            acc[item.groupName].versions.push(item);
            return acc;
          }, {}),
      );
    };

    const updateSearchResults = (results) => {
      if (results.length === 0) {
        resultsContainer.innerHTML = `<div class="mg-t-sm">No downloads found.</div>`;
        return;
      }

      const columnsHTML = results
        .map(
          (group) => `
        <div class="list-column list-column--sublists">
          <h2>${group.name}</h2>
          <ul>
            ${group.versions
              .map(
                (version) => `
              <li>
                <a href="${version.link}">
                  <span>${version.versionName === "default" ? "Download" : `${group.name} ${version.versionName}`}</span>
                  <i class="fas fa-arrow-right"></i>
                </a>
              </li>
            `,
              )
              .join("")}
          </ul>
        </div>
      `,
        )
        .join("");

      resultsContainer.innerHTML = `
        <div class="vertical-lists" style="--cols: ${Math.min(results.length, 3)}">
          ${columnsHTML}
        </div>
      `;
    };

    const init = (element) => {
      const searchInput = element.querySelector(".search-input");
      resultsContainer = element.querySelector(".search-results");

      // Load data immediately
      loadDownloadsData();

      const debouncedSearch = debounce(() => {
        if (searchInput.value.trim() === "") {
          resultsContainer.innerHTML = "";
          return;
        }
        const searchTerm = searchInput.value.trim();
        if (searchTerm.length < 2) {
          resultsContainer.innerHTML = "";
          return;
        }
        const results = filterDownloads(searchTerm);
        updateSearchResults(results);
      }, 300);

      searchInput.addEventListener("input", debouncedSearch);

      searchInput.value = "xen sss";
      searchInput.dispatchEvent(new Event("input"));
    };
    init(element);
  };
  // Initialize the search functionality
  document.querySelectorAll(selector).forEach(downloadsSearch);
})();
