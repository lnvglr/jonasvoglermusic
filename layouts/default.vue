<template>
  <transition name="fade">
    <div id="app" v-if="ready">
      <app-header />
      <main class="wrap">
        <Nuxt />
      </main>
      <app-footer />
    </div>
  </transition>
</template>
<script>
import Header from '@/components/partials/Header.vue'
import Footer from '@/components/partials/Footer.vue'
import SETTINGS from '@/settings'
import axios from 'axios'

export default {
  components: {
    appHeader: Header,
    appFooter: Footer,
  },
  data: () => ({
    fontsLoaded: false,
  }),
  mounted() {
    document.fonts.ready.then(() => {
      this.fontsLoaded = true
    })
  },
  computed: {
    ready() {
      return true
      // return this.fontsLoaded
    },
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
  main {
    flex: 1;
    padding-top: 0;
  }
}
</style>
