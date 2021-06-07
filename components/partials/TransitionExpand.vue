<template>
  <transition
    name="expand"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
  >
    <slot/>
  </transition>
</template>

<script>
export default {
  name: 'TransitionExpand',
  props: ['scrollReference'],
  methods: {
    enter (element) {
      const width = getComputedStyle(element).width

      element.style.width = width
      element.style.position = 'absolute'
      element.style.visibility = 'hidden'
      element.style.height = 'auto'

      const height = getComputedStyle(element).height

      element.style.width = null
      element.style.position = null
      element.style.visibility = null
      element.style.height = 0

      // Force repaint to make sure the
			// animation is triggered correctly.
      getComputedStyle(element).height // eslint-disable-line no-unused-expressions

      // Trigger the animation.
      // We use `requestAnimationFrame` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      requestAnimationFrame(() => {
        element.style.height = height
      })
      window.scrollTo({
        top: this.scrollReference,
        behavior: 'smooth'
      })
    },
    afterEnter (element) {
      element.style.height = 'auto'
    },
    leave (element) {
      const height = getComputedStyle(element).height

      element.style.height = height

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height // eslint-disable-line no-unused-expressions

      requestAnimationFrame(() => {
        element.style.height = 0
      })
    }
  }
}
</script>

<style scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}
</style>
