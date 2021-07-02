// utils/getRoutes.js
import axios from "axios"

export async function getRoutes(base) {
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
