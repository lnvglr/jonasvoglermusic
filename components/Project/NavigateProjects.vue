<template>
  <nav>
    <div
      ref="prev"
      @click="openProjectByIndex(currentIndex - 1)"
      :title="title([currentIndex - 1])"
    >
      <span class="sr-only">{{title([currentIndex - 1])}}</span>
    </div>
    <div
      ref="next"
      @click="openProjectByIndex(currentIndex + 1)"
      :title="title([currentIndex + 1])"
    >
      <span class="sr-only">{{title([currentIndex + 1])}}</span>
    </div>
  </nav>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Details',
  props: {
    projects: Array,
  },
  data() {
    return {
      currentIndex: -1,
    }
  },
  computed: {
    ...mapGetters({
      openProject: 'project/open',
    }),
  },
  mounted() {
    if (this.projects) this.setIndex(this.projects, this.openProject)
    // document.addEventListener('keydown', this.keydown);
  },
  methods: {
    openProjectByIndex(index) {
      const slug = this.projects[index] ? this.projects[index].slug : null
      if (!slug && index === -1) window.scrollTo({ top: 0, behavior: 'smooth'})
      this.$store.dispatch('changeRoute', slug)
    },
    title(index) {
      return this.projects[index]?.title.rendered
    },
    setIndex(projects, open) {
      this.currentIndex = projects.indexOf(
        projects.find((e) => e.slug === open)
      )
    },
    keydown(e) {
      switch(e.code) {
        case 'ArrowLeft':
          this.$refs.prev?.click()
          break
        case 'ArrowRight':
          this.$refs.next?.click()
          break
      }
    }
  },
  watch: {
    projects(projects) {
      this.setIndex(projects, this.openProject)
    },
    openProject(slug) {
      this.setIndex(this.projects, slug)
    },
  },
}
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  display: flex;
  flex-direction: column;
  bottom: 0;
  right: 0;
  z-index: 999;
  @include dynamic-box(margin);
  @media screen and (pointer: coarse), (pointer: none) {
    margin: map-get($padding-sizes, xlarge);
  }

  div {
    --scale: 1;
    --rotate-button: 90deg;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--button-size-medium);
    min-width: var(--button-size-medium);
    height: var(--button-size-medium);
    border-radius: var(--button-size-medium);
    background: #ffffff60;
    backdrop-filter: var(--blur);
    transform: scale(var(--scale)) rotate(var(--rotate-button));
    color: $black;
    margin: 0.25em;
    &::before,
    &::after {
      content: '';
      --translate-stroke: -0.5;
      --rotate-stroke: 45deg;
      will-change: opacity, transform;
      backface-visibility: hidden;
      perspective: 1000px;
      display: block;
      height: var(--stroke);
      width: calc(var(--button-size-medium) / 3);
      position: absolute;
      background-color: currentColor;
      transform: translate(0, calc(var(--translate-stroke) * var(--stroke)))
        rotate(var(--rotate-stroke));
      transform-origin: 0% 100%;
      transition: transform $fast-02 $expressive;
    }
    &::after {
      transform-origin: 0% 0%;
      --translate-stroke: 0.5;
      --rotate-stroke: -45deg;
    }
    &:hover {
      --scale: 0.95;
      background: #00000040;
      color: $white;
      transition: $fast-02;

      &::before {
        --rotate-stroke: 40deg;
        --translate-stroke: -0.4;
      }
      &::after {
        --rotate-stroke: -40deg;
        --translate-stroke: 0.4;
      }
    }
    &:active {
      --scale: 0.9;
    }
    &:last-child {
      --rotate-button: 270deg;
    }
  }
}
</style>
