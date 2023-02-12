<template>
  <footer class="site-footer" v-if="bloginfo">
    <div class="wrap footer-wrap">
      <div v-for="page in pages('footer')" :key="page.id" class="page-link">
        <NuxtLink :to="page.slug" v-if="page.title">
          {{ page.title.rendered }}</NuxtLink
        >
      </div>
    </div>
    <div class="copyright">{{ date }} &copy; {{ bloginfo.name }}</div>
    <small class="credits">
      This site was created by
      <a href="http://www.leonvogler.de" rel="noopener" target="_blank">Leon Vogler</a>.
    </small>
    <small class="version" v-if="version">v{{ version }}</small>
    <client-only>
      <CookieNotice />
    </client-only>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'

import ExperimentalButton from '../partials/ExperimentalButton.vue'
import CookieNotice from '../partials/CookieNotice.vue'
export default {
  components: { ExperimentalButton, CookieNotice },
  name: 'Footer',
  data() {
    return {
      version: 'v0.1.0',
    }
  },
  computed: {
    ...mapGetters({
      pages: 'pages/getPages',
      bloginfo: 'getBloginfo',
    }),
    experimental() {
      return true
    },
    date() {
      return new Date(this.bloginfo?.date * 1000).getFullYear()
    },
  },
  async fetch() {
    this.version = process.env.PACKAGE_VERSION || false
  },
}
</script>

<style lang="scss" scoped>
.site-footer {
  // margin-bottom: 66px; // player height
  line-height: 1.7;
  color: $dark-02;
  background: $light-02;
  padding: 25px 0;
  @media screen and (min-width: map-get($breakpoints, large)) {
    padding: 50px 0;
  }
  .footer-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .copyright,
  .credits {
    text-align: center;
    color: $dark-01;
  }
  .credits {
    display: block;
    a:hover {
      color: $secondary;
    }
  }
  .version {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    color: $light-03;
  }
  .page-link {
    margin: map-get($padding-sizes, medium) 0;
    white-space: nowrap;
    a {
      padding: map-get($padding-sizes, medium);
    }
  }
  .experimental-button {
    // position: fixed;
    // left: 0;
    // bottom: 0;
    background: transparent !important;
    color: $light-03;
    &.active {
      color: $primary;
    }
  }
}
</style>
