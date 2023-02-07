<template>
  <div id="app" :class="{ show: fontsLoaded, experimental, [currentPage]: currentPage }">
    <div class="above-the-fold">
      <Header />
      <main class="wrap">
        <Nuxt />
      </main>
    </div>
    <Footer />
  </div>
</template>
<script>
import Header from '@/components/Layout/Header.vue'
import Footer from '@/components/Layout/Footer.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  components: {
    Header,
    Footer,
  },
  data: () => ({
    fontsLoaded: false,
  }),
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
      projectOpen: 'project/open',
    }),
    currentPage() {
      return this.$nuxt.$route.params.pageSlug
    }
  },
  mounted() {
    if (process.server) this.fontsLoaded = trueFrale

    document.fonts.ready.then(() => {
      setTimeout(() => {
        this.fontsLoaded = true
      }, 100)
    })
    setTimeout(() => {
      this.fontsLoaded = true
    }, 1000)
  },
  async fetch() {
    const { data: info } = await axios.get(process.env.API_BASE_PATH + 'bloginfo')
    const { data: pages } = await axios.get(process.env.API_BASE_PATH + 'pages')
    console.log('url', process.env.API_BASE_PATH + 'pages')
    console.log('pages', pages)
    this.$store.dispatch('setBloginfo', info)
    this.$store.dispatch('pages/set', pages)
  },
}
</script>


<style lang="scss">
@import '~/assets/styles/base';
#app {
  --body-background: #{$light-01};
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: $extraslow-02;
  background-color: var(--body-background);
  &:not(.show) {
    opacity: 0;
  }
  .above-the-fold {
    flex: 1;
    min-height: 100vh;
  }
  main {
    flex: 1;
    // z-index: 10;
    padding-top: 0;
  }
  // &.dark {
  // 	background-color: #000;
  // 	color: $white;
  //   transition: opacity, background-color, color $extraslow-02;
  // }
}
.experimental {
  --font-family: Raleway, Gramatika-Regular, Gilroy, sans-serif;
}
</style>
