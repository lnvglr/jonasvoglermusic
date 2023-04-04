<template>
  <div>
    <div class="reel" v-if="reel">
      <Reel :project="reel" :isOpen="true" />
    </div>
    <div style="position: relative">
      <transition name="slide-in"
        ><NavigateProjects v-if="openProject" :projects="filteredProjects"
      /></transition>
      <FilterPills
        :items="filterElements"
        label="slug"
        value="name"
        class="filter-container"
      />
      <transition-group
        tag="div"
        name="fade-list"
        class="projects"
        :style="{ '--total': filteredProjects.length }"
      >
        <Project
          v-for="(project, index) in filteredProjects"
          ref="project"
          :project="project"
          :index="index"
          :key="project.id"
          :style="{ '--i': index }"
          :isOpen="slug === project.slug"
          @open="slug = $event"
          @close="close"
          :reference="$refs ? $refs : {}"
        />
      </transition-group>
      <div class="projects phantom" aria-hidden="true">
        <ProjectPhantom
          v-for="project in filteredProjects"
          :ref="`project-${project.slug}`"
          :key="project.id"
        />
      </div>
      <Laurel />
    </div>
  </div>
</template>

<script>
import Project from "@/components/Project/Project.vue";
import Reel from "@/components/Project/Reel.vue";
import ProjectPhantom from "@/components/Project/ProjectPhantom.vue";
import NavigateProjects from "@/components/Project/NavigateProjects.vue";
import FilterPills from "~/components/partials/FilterPills.vue";
import { mapGetters } from "vuex";
import Laurel from "~/assets/images/laurel.vue";

export default {
  name: "Projects",
  components: {
    Project,
    Reel,
    ProjectPhantom,
    NavigateProjects,
    FilterPills,
    Laurel,
  },
  data() {
    return {
      initiated: false,
    };
  },
  head() {
    return {
      __dangerouslyDisableSanitizers: ["script"],
      script: [
        {
          innerHTML: JSON.stringify(this.structuredData),
          type: "application/ld+json",
        },
      ],
    };
  },
  mounted() {
    setTimeout(() => {
      this.initiated = true;
    }, 200);
  },
  methods: {
    toggleFilter(slug) {
      this.$store.dispatch("updateFilter", slug);
    },
    close() {
      this.slug = null;
      setTimeout(() => {
        this.$refs.project.forEach((e) => e.initialFadeIn());
      }, 500);
    },
  },
  computed: {
    ...mapGetters({
      openProject: "project/open",
      filter: "filter",
      bloginfo: "getBloginfo",
    }),
    filterElements() {
      if (!this.initiated) return [];
      const genres = this.projects
        ?.filter((e) => !e?.field?.reel)
        ?.map((project) => project?.field?.genre);
      const all = {
        term_id: -1,
        name: "All",
        slug: "all",
      };
      genres.unshift(all);
      return genres.filter(
        (e, i) => genres.findIndex((a) => a.slug === e.slug) === i
      );
    },
    project() {
      return this.projects?.find((e) => e.slug === this.slug);
    },
    reel() {
      if (!this.initiated) return false;
      return this.projects?.find((e) => e?.field?.reel);
    },
    filteredProjects() {
      if (!this.initiated) return [];
      if (this.filter.length === 0)
        return this.projects.filter((project) => !project?.field?.reel);
      return this.projects.filter((project) => {
        return (
          !project?.field?.reel &&
          this.filter.includes(project?.field?.genre?.slug)
        );
      });
    },
  },
  watch: {
    openProject(slug) {
      this.slug = slug;
    },
  },
  updated() {
    this.$meta().refresh();
  },
  metaInfo() {
    const siteTitle = this.bloginfo.name;
    const title = this.project?.title.rendered
      ? `${this.project.title.rendered} – ${siteTitle}`
      : siteTitle;
    const description =
      this.project?.excerpt.rendered?.replace(/<[^>]*>?/gm, "") || "";
    return {
      title,
      meta: [
        {
          name: "description",
          content: description,
        },
        {
          property: "og:title",
          content: title,
        },
        {
          property: "og:image",
          content: this.project?.thumbnail?.["cinema-medium"]?.[0],
        },
      ],
    };
  },
  async asyncData({ $axios, params, req, store }) {
    // called every time before loading the component
    let { data: projects } = await $axios.get(
      process.env.API_BASE_PATH + "posts?order=asc&per_page=100"
    );
    projects = projects
      .sort((a, b) => (a?.field.menu_order > b?.field.menu_order ? 1 : -1))
      .map((e) => {
        e.link = e.link.replace("https://api.", "https://");
        return e;
      });

    const url = process.server && req ? req.url : null;
    const slug = url
      ? url.split(process.env.projectPath)[1]?.split("?")[0]
      : (params.projectSlug || '/');
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: projects.map((project, i) => {
        return {
          "@type": "ListItem",
          position: i + 1,
          url: project.link,
        };
      }),
    };
    store.dispatch("project/setProjects", projects);
    store.dispatch("project/setOpen", slug);
    return {
      slug,
      projects,
      structuredData,
    };
  },
};
</script>

<style lang="scss" scoped>
.projects {
  position: relative;
  margin-bottom: 50px;
  & > *:not(:last-child):after {
    content: "";
    position: absolute;
    width: 100px;
    height: var(--stroke);
    left: 50%;
    transform: translateX(-50%);
    background: $light-02;
  }
}
@media screen and (min-width: 1080px) {
  .reel {
    margin-inline: -2rem;
  }
}
</style>
