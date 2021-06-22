// utils/getRoutes.js
const axios = require("axios");

module.exports = async function getAppRoutes() {
  const base = "https://api.jonasvoglermusic.de/wp-json/wp/v2/";
  const { data: projects } = await axios.get(
    base + "posts?filter[orderby]=date&order=asc&per_page=100"
  );
  const { data: pages } = await axios.get(base + "pages");
  const routes = [
    ...projects.map(e => {
      return {
        url: "/project/" + e.slug,
        lastmod: e.modified
      };
    }),
    ...pages.map(e => {
      return {
        url: e.slug,
        lastmod: e.modified
      };
    })
  ];
  return routes;
};
