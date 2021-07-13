// utils/getRoutes.js
const axios = require("axios")

module.exports = async function getRoutes(base) {
  const { data: projects } = await axios.get(
    base + "posts?per_page=100"
  );
  const { data: pages } = await axios.get(base + "pages");
  const lowerPriority = ['legal-notice', 'privacy-policy']
  const lowerFrequency = ['legal-notice', 'privacy-policy']
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
        lastmod: e.modified,
        priority: lowerPriority.includes(e.slug) ? 0.8 : 1,
        changefreq: lowerFrequency.includes(e.slug) ? 'monthly' : 'weekly'
      };
    })
  ];
  return routes;
};
