<template>
  <div v-if="experimental">
    <NuxtLink
      :to="{ name: 'Home' }"
      class="title"
      @click.native="
        $store.dispatch('updateFilter', null), $store.dispatch('project/setOpen', null)
      "
    ><h1 class="logo">{{ name }}</h1><span class="description" v-html="copy"></span><span class="description addition" v-html="addition"></span></NuxtLink>
  </div>
  <NuxtLink
    v-else
    :to="{ name: 'Home' }"
    @click.native="$store.dispatch('updateFilter', null), $store.dispatch('project/setOpen', null)"
  >
    <h1 class="logo">{{ name }}</h1>
    <span v-if="description" class="subtitle">{{ description }}</span>
  </NuxtLink>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    name: String,
    description: String,
  },
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
    copy() {
    let location
      switch(this.$nuxt.$route.params.pageSlug) {
        case 'privacy-policy':
        case 'legal-notice':
          location = ''
          break
        default:
          location = ' is a composer for film and television'
          break
      }
      return location
    },
    addition() {
      let location
      switch(this.$nuxt.$route.params.pageSlug) {
        case 'about-contact':
          location = ' based in Berlin.'
          break
        case 'music':
          location = ' who happens to also compose music without picture.'
          break
        case 'privacy-policy':
        case 'legal-notice':
          location = ''
          break
        default:
          location = '.'
          break
      }
      // setTimeout(() => { return location}, 300)
      return location
    }
  },
}
</script>

<style lang="scss" scoped>
.logo {
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 1;
  margin: 0;
}
.subtitle {
  font-size: 1rem;
  font-weight: normal;
  margin: nth(map-get($padding-sizes, medium), 1) 0;
  line-height: 1.2;
  letter-spacing: $letter-spacing;
}
</style>
<style lang="scss">
.experimental {
  .subtitle {
    letter-spacing: 0;
  }
  .title {
    & > * {
      font-size: 4rem;
      font-weight: bold;
      display: inline;
      text-transform: initial;
      @media screen and (max-width: map-get($breakpoints, medium)) {
        font-size: 2rem;
      }
    }
  }
  .description {
    color: $dark-01;
  }
  .addition {
    animation: type 4s steps(60, end); 
  }

}
@keyframes type {
  from { width: 0; }
} 
</style>
