<template>
  <div class="project">
    <div class="project-header">
      <div :style="`padding-bottom: ${aspectRatio}%;`" ref="offset"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectPhantom',
  props: {
    aspectRatio: {
      type: Number,
      default: 41.89,
    },
  },
}
</script>

<style lang="scss">
.project-header {
  width: 100%;
  @include dynamic-box($axis: vertical);
}
.phantom {
  opacity: 0;
  z-index: -1;
  pointer-events: none;
  position: absolute !important;
  width: 100%;
  top: 54px;
  &:after {
    opacity: 0;
  }
}
</style>
