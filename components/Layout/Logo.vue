<template>
  <div v-if="experimental">
    <NuxtLink to="/" class="title-container" ref="title" @click.native="home"
      ><span class="string"
        ><h1 class="logo">{{ name }}</h1>
        <transition name="slide-in" mode="out-in" @enter="adjustHeight">
          <span class="description" v-if="!legal && !music">is a composer for film and television</span>
          <span v-else key="blank"></span>
        </transition>
        <transition name="slide-in" mode="out-in" @enter="adjustHeight">
          <span class="description" v-if="music" v-html="music" key="music"></span>
          <span
            class="description"
            v-else-if="aboutContact"
            v-html="aboutContact"
            key="aboutContact"
          ></span>
          <span v-else-if="!legal" class="description" key="dot" style="margin-left: -0.375ch"
            >.</span
          >
          <span v-else key="blank"></span>
        </transition>
      </span>
    </NuxtLink>
  </div>
  <NuxtLink v-else to="/" @click.native="home">
    <h1 class="logo">{{ name }}</h1>
    <span v-if="description" class="subtitle">{{ description }}</span>
  </NuxtLink>
</template>
<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash.throttle'

export default {
  props: {
    name: String,
    description: String,
  },
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
    legal() {
      return ['privacy-policy', 'legal-notice'].includes(this.$nuxt.$route.params.slug)
    },
    music() {
      return 'music' === this.$nuxt.$route.params.slug
        ? 'happens to also compose music without picture.'
        : false
    },
    aboutContact() {
      return 'about-contact' === this.$nuxt.$route.params.slug ? 'based in Berlin.' : false
    },
  },
  methods: {
    home() {
      this.$store.dispatch('updateFilter', null)
      this.$store.dispatch('project/setOpen', null)
    },
    adjustHeight() {
      if (this.$refs.title && this.$refs.string) {
        this.$refs.title.$el.style.height = this.$refs.string.$el.clientHeight + 'px'
      }
    },
  },
  mounted() {
    window.addEventListener('resize', throttle(this.adjustHeight, 100))
  },
  unmounted() {
    window.removeEventListener('resize', throttle(this.adjustHeight, 100))
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
}
</style>
<style lang="scss">
.experimental {
  header {
    .title-container {
      font-size: 4rem;
      color: $light-03;
      font-weight: bold;
      transition: height $slow-02;
      @media screen and (max-width: map-get($breakpoints, large)), (max-height: 480px)  {
        font-size: 3rem;
      }
      @media screen and (max-width: map-get($breakpoints, medium)), (max-height: 320px) {
        font-size: 2rem;
      }
      .string {
        min-height: 1em;
        display: block;
        line-height: 1.1;
        .logo {
          color: $black;
        }
        & > * {
          font-size: inherit;
          display: inline;
          text-transform: initial;
        }
      }
    }
  }
}
</style>
