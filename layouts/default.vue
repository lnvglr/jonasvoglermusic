<template>
  <div id="app" :class="{ show: fontsLoaded, experimental }">
    <app-header />
    <main class="wrap">
      <Nuxt />
    </main>
    <app-footer />
  </div>
</template>
<script>
import Header from '@/components/partials/Header.vue'
import Footer from '@/components/partials/Footer.vue'
import axios from 'axios'
import { mapGetters } from 'vuex'

export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
  },
  data: () => ({
    fontsLoaded: false,
  }),
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
  },
  mounted() {
    if (process.server) this.fontsLoaded = true

    document.fonts.ready.then(() => {
      setTimeout(() => {
        this.fontsLoaded = true
      }, 500)
    })
  },
  async fetch() {
    const { data: info } = await axios.get(process.env.API_BASE_PATH + 'bloginfo')
    const { data: pages } = await axios.get(process.env.API_BASE_PATH + 'pages')
    this.$store.dispatch('setBloginfo', info)
    this.$store.dispatch('pages/set', pages)
  },
}
</script>


<style lang="scss">
@import '~/assets/styles/base';
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  transition: opacity $extraslow-02;
  &:not(.show) {
    opacity: 0;
  }
  main {
    flex: 1;
    padding-top: 0;
  }
}
.experimental {
  --font-family: Gramatika-Regular, Gilroy, sans-serif;
  --font-family-bold: Gramatika-Bold, Gilroy, sans-serif;
  font-family: var(--font-family);
  &:after {
    // content: '';
    pointer-events: none;
    width: 100vw;
    height: 100vh;
    position: fixed;
    box-shadow: inset 0 0 0 5px rgb(237, 106, 101), 0 0 0 5px rgb(237, 106, 101);
    border-radius: 0 0 12px 12px;
  }
}
</style>
