<template>
  <div class="archive-page wrap">
    <h1>Archive</h1>
    <ul class="archive-list" v-if="projects && projects.length">
      <li v-for="project in projects" :key="project.id" class="archive-item">
        <NuxtLink
          :to="{ name: 'archive-slug', params: { slug: project.slug } }"
        >
          {{
            [
              project.plainTitle || project.slug,
              project.field.details.find((e) =>
                e.label.toLowerCase().includes("year")
              )?.value,
            ]
              .filter((e) => e)
              .join(", ")
          }}
        </NuxtLink>
      </li>
    </ul>
    <p v-else>No projects found.</p>
  </div>
</template>

<script>
// Minimal HTML entity decoder that works in SSR and client
function decodeEntities(input) {
  if (!input || typeof input !== "string") return "";
  // Strip HTML tags first
  const noTags = input.replace(/<[^>]*>?/gm, "");
  const named = {
    amp: "&",
    lt: "<",
    gt: ">",
    quot: '"',
    apos: "'",
    nbsp: " ",
    ndash: "–",
    mdash: "—",
    hellip: "…",
    lsquo: "‘",
    rsquo: "’",
    ldquo: "“",
    rdquo: "”",
  };
  return noTags.replace(/&(#x?[0-9a-fA-F]+|[a-zA-Z]+);/g, (m, ent) => {
    if (ent[0] === "#") {
      try {
        if (ent[1]?.toLowerCase() === "x")
          return String.fromCodePoint(parseInt(ent.slice(2), 16));
        return String.fromCodePoint(parseInt(ent.slice(1), 10));
      } catch (_) {
        return m;
      }
    }
    return Object.prototype.hasOwnProperty.call(named, ent) ? named[ent] : m;
  });
}

export default {
  name: "ArchivePage",
  data() {
    return {
      projectPath: process.env.projectPath || "/project/",
    };
  },
  head() {
    return {
      title: "Archive – Jonas Vogler",
    };
  },
  async asyncData({ $axios }) {
    try {
      // Resolve the tag id for slug 'archive' and exclude it from results
      let archiveTagId = null;
      try {
        const { data: tags } = await $axios.get(
          process.env.API_BASE_PATH + "tags",
          { params: { slug: "archive" } }
        );
        archiveTagId = Array.isArray(tags) && tags.length ? tags[0].id : null;
      } catch (e) {
        // ignore tag lookup failures; we'll just not exclude
      }

      const params = {
        order: "asc",
        per_page: 100,
      };
      if (archiveTagId) params.tags = archiveTagId;

      let { data: projects } = await $axios.get(
        process.env.API_BASE_PATH + "posts",
        { params }
      );
      projects = projects
        .sort((a, b) => (a?.field?.menu_order > b?.field?.menu_order ? 1 : -1))
        .map((e) => {
          e.link = e.link?.replace("https://api.", "https://");
          e.plainTitle = decodeEntities(e?.title?.rendered || "");
          return e;
        });
      return { projects };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return { projects: [] };
    }
  },
};
</script>

<style lang="scss" scoped>
.archive-page {
  padding-top: 2rem;
  padding-inline: 0;
  h1 {
    font-weight: normal;
  }
}
.archive-list {
  list-style: none;
  padding-left: 0;
}
.archive-item {
  margin: 0.5rem 0;
  a:hover {
    text-decoration: underline;
    color: $primary;
  }
}
</style>
