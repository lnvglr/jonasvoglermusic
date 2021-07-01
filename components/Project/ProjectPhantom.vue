<template>
  <div class="project">
    <div class="project-header">
      <div :style="`padding-bottom: ${aspectRatio}%;`"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProjectPhantom',
  props: {
    aspectRatio: {
      type: Number,
      default: 41.89
    }
  },
}
</script>

<style lang="scss">
// .project .project-header {
//   width: 100%;
//   @include dynamic-box($axis: vertical);
// }
</style>
