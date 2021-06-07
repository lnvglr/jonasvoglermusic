<template>
  <img
    :data-srcset="lazySrcset"
    :data-src="lazySrc"
    :src="lazySrc"
    class="lazy-image"
  />
</template>

<script>
import lozad from 'lozad'

export default {
  name: 'LazyImage',
  props: {
    lazySrc: {
      type: String,
      default: null
    },
    lazySrcset: {
      type: String,
      default: null
    }
  },
  data () {
    return {
      loaded: false
    }
  },
  mounted () {
    const observer = lozad(this.$el)
    observer.observe()
    this.heroLoaded()
  },
  methods: {
    heroLoaded() {
      const self = this
      this.$el.onload = function () {
        this.setAttribute('data-fully-loaded', true)
        self.$emit('loaded', true)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
img {
  &:not([data-loaded]) {
    opacity: 0;
  }
  background-size: cover;
  background-position: center;
}
</style>
