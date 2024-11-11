(() => {
  const selector = ".latest-news";
  const blogs = [
    {
      id: "xenprojectblog",
      name: "xenproject blog",
      url: "/blog",
      API_KEY: siteParams.blogapikey,
    },
  ];

  const createTemplate = (() => {
    let template = "";
    return () => {
      if (!template) {
        template = document.querySelector(".latest-news-template").innerHTML;
      }
      return new Function("_", "return `" + template + "`");
    };
  })();

  const latestnews = async (element) => {
    const newsCardTemplate = createTemplate();
    const container = element.querySelector(".latest-news_container");
    const { maxCards, blogFilter, tagFilter } = element.dataset;
    const blogIds = blogFilter?.split(",") || blogs.map((blog) => blog.id);
    const tags = (tagFilter?.split(",") || []).filter((tag) => tag !== "");
    const posts = await getLatestPost({ maxCards: maxCards * 1 || 10, blogFilter: blogIds, tagFilter: tags });
    container.innerHTML = posts.map(newsCardTemplate).join("");
  };

  const getLatestPost = async ({ maxCards, blogFilter, tagFilter }) => {
    const blogsPosts = [];
    for (const { url, API_KEY, name } of blogs.filter((blog) => blogFilter.includes(blog.id))) {
      try {
        const res = await fetch(
          `${url}/ghost/api/content/posts/?key=${API_KEY}&limit=${tagFilter.length > 0 ? 100 : maxCards}&include=authors,tags${
            tagFilter.length > 0 ? `&filter=tags:${tagFilter}` : ""
          }`,
        );
        const { posts } = await res.json();
        blogsPosts.push(
          ...posts.map((post) => ({
            ...post,
            blogName: name,
            blogUrl: url,
          })),
        );
      } catch (e) {
        console.error("Error on fetch blog posts for blog", url);
      }
    }
    return blogsPosts.sort((a, b) => new Date(b.published_at) - new Date(a.published_at)).slice(0, maxCards);
  };

  [...document.querySelectorAll(selector)].forEach((elm) => {
    latestnews(elm);
  });
})();
