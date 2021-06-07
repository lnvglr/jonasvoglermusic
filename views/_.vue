<template>
  <div id="app">
    <main class="wrap">
      <!-- <RecentProjects /> -->
    </main>
  </div>
</template>

<script>
// import RecentProjects from '@/components/Project/RecentProjects.vue'

export default {
  components: {
    // RecentProjects,
  },
  mounted() {
    if (this.project) this.$store.commit('changeRoute', this.project)
    this.$store.commit('setProjects')

  },
  asyncData({req, store}) {
    const url = process.server ? req.url : null
    const project = url ? url.split('/project/')[1] : null
    return {
      pages: store.state.pages.header,
      project: project
    }
  },
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
main {
  flex-grow: 1;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
