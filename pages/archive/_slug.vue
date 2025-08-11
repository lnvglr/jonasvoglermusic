<template>
  <div class="archive-project-page">
    <div>
      <span
        v-if="projectSubtitle"
        v-for="subtitle in projectSubtitle"
        :key="subtitle"
        class="project-category"
        >{{ subtitle }}</span
      >
    </div>
    <h1 class="project-title">{{ projectTitle }}</h1>
    <div class="project-description" v-html="content"></div>
    <ul class="project-details"><li v-for="detail in project.field.details" :key="detail.label">{{ detail.label }}: {{ detail.value }}</li></ul>
    <div class="back-to-archive"><a href="/archive">Back to archive</a></div>
  </div>
</template>

<script>
import Project from "@/components/Project/Project.vue";
import { mapGetters } from "vuex";
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

  function stripFiguresAndImages(input) {
    return input.replace(/<([a-z0-9]+)\b[^>]*\bclass=["'][^"']*\bwp-block-gallery\b[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<([a-z0-9]+)\b[^>]*\bclass=["'][^"']*\bblocks-gallery-item\b[^"']*["'][^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<figcaption\b[^>]*>[\s\S]*?<\/figcaption>/gi, '');

}

export default {
  name: "archive-slug",
  components: { Project },
  computed: {
    ...mapGetters({ bloginfo: "getBloginfo" }),
    metaTitle() {
      const siteTitle = this.bloginfo?.name || "Jonas Vogler";
      return this.project?.title?.rendered
        ? `${this.project.title.rendered.replace(
            /<[^>]*>?/gm,
            ""
          )} – ${siteTitle}`
        : siteTitle;
    },
    projectTitle() {
      return decodeEntities(this.project.title.rendered);
    },
    projectSubtitle() {
      const details = [
        this.project.field?.genre?.name,
        this.project.field?.details.length > 0
          ? this.project.field?.details.find((e) =>
              e.label.toLowerCase().includes("year")
            )?.value
          : "",
      ];
      return details.filter((e) => e !== null);
    },
    content() {
      return stripFiguresAndImages(this.project.content.rendered);
    },
    metaDescription() {
      return this.project?.excerpt?.rendered?.replace(/<[^>]*>?/gm, "") || "";
    },
    ogImage() {
      return this.project?.thumbnail?.["cinema-medium"]?.[0] || "";
    },
  },
  head() {
    return {
      title: this.metaTitle,
      meta: [
        {
          hid: "description",
          name: "description",
          content: this.metaDescription,
        },
        { property: "og:title", content: this.metaTitle },
        { property: "og:image", content: this.ogImage },
      ],
    };
  },
  async asyncData({ $axios, params }) {
    try {
      // Fetch the tag id for slug 'archive' to scope query
      let archiveTagId = null;
      try {
        const { data: tags } = await $axios.get(
          process.env.API_BASE_PATH + "tags",
          {
            params: { slug: "archive" },
          }
        );
        archiveTagId = Array.isArray(tags) && tags.length ? tags[0].id : null;
      } catch (_) {
        // ignore
      }

      const queryParams = { slug: params.slug, per_page: 1 };
      if (archiveTagId) queryParams.tags = archiveTagId;

      const { data } = await $axios.get(process.env.API_BASE_PATH + "posts", {
        params: queryParams,
      });
      const [project] = Array.isArray(data) ? data : [];
      if (!project) return { project: null };

      project.link = project.link?.replace("https://api.", "https://");
      return { project };
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
      return { project: null };
    }
  },
};
</script>

<style lang="scss" scoped>
.archive-project-page {
  padding-top: 0.5rem;
}
.project-category {
  display: inline-block;
  margin-right: 0.5rem;
  color: hsl(0, 0%, 80%);
}
.project-title {
  font-size: 1.5rem;
  font-weight: 500;
}
.project-description {
  font-family: $font-family-serif;
  font-size: 1rem;
  @media screen and (min-width: map-get($breakpoints, medium)) {
    font-size: 1.125rem;
  }
  @media screen and (min-width: map-get($breakpoints, large)) {
    font-size: 1.25rem;
  }
  .wp-block-audio {
    margin: 1em 0;
    margin-inline-start: 0;
    margin-inline-end: 0;
  }
  & > *:first-child {
    margin-top: 0;
  }
  & > *:last-child {
    margin-bottom: 0;
  }
  &::v-deep a {
    color: $primary;
    &:hover {
      text-decoration: underline;
    }
  }
}
.project-details {
  display: block;
  flex-wrap: wrap;
  list-style: none;
  line-height: 1.4;
  font-size: 0.75rem;
  padding: 0;
  font-weight: 300;
}
.back-to-archive {
  margin-top: 5rem;
  font-size: 0.875rem;
}
</style>
