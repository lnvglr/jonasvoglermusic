<template>
  <nav>
    <div
      @click="openProjectByIndex(currentIndex - 1)"
      :title="title([currentIndex - 1])"
    >
      <span class="sr-only">{{title([currentIndex - 1])}}</span>
    </div>
    <div
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
  methods: {
    openProjectByIndex(index) {
      const slug = this.projects[index] ? this.projects[index].slug : null
      this.$store.dispatch('changeRoute', slug)
    },
    title(index) {
      return this.projects[index]?.title.rendered
    }
  },
  mounted() {
    this.currentIndex = this.projects.indexOf(
      this.projects.find((e) => e.slug === this.openProject)
    )
  },
  watch: {
    openProject(slug) {
      this.currentIndex = this.projects.indexOf(this.projects.find((e) => e.slug === slug))
    },
  },
}
</script>

<style lang="scss" scoped>
nav {
  position: fixed;
  display: flex;
  bottom: 0;
  right: 0;
  z-index: 999;
  @include dynamic-box(margin);
  div {
    --scale: 1;
    --rotate-button: 0deg;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: var(--button-size);
    min-width: var(--button-size);
    height: var(--button-size);
    border-radius: var(--button-size);
    background: #ffffff80;
    backdrop-filter: var(--blur);
    transform: scale(var(--scale)) rotate(var(--rotate-button));
    color: $dark-02;
    &::before,
    &::after {
      --translate-stroke: 10;
      --rotate-stroke: 45deg;
      content: '';
      will-change: opacity, transform;
      backface-visibility: hidden;
      perspective: 1000px;
      display: block;
      height: var(--stroke);
      width: calc(var(--button-size) / 3);
      position: absolute;
      background-color: currentColor;
      transform: translate(-1px, calc(var(--button-size) / var(--translate-stroke)))
        rotate(var(--rotate-stroke));
    }
    &::after {
      --translate-stroke: -10;
      --rotate-stroke: -45deg;
    }
    &:hover {
      --scale: 0.95;
      background: #00000040;
      color: $white;
      transition: $fast-02;
    }
    &:active {
      --scale: 0.9;
    }
    &:last-child {
      --rotate-button: 180deg;
    }
    & + * {
      margin-left: 0.5em;
    }
  }
}
</style>
