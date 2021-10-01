<template>
  <transition name="expand" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
    <slot />
  </transition>
</template>

<script>
import variables from '@/assets/styles/_variableExport.scss'

export default {
  name: 'TransitionExpand',
  props: ['scrollReference'],
  data: () => ({ variables }),
  methods: {
    enter(element) {
      // Trigger the animation.
      // We use `requestAnimationFrame` because we need
      // to make sure the browser has finished
      // painting after setting the `height`
      // to `0` in the line above.
      window.scrollTo({
        top: this.scrollReference,
        behavior: 'smooth',
      })
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

      requestAnimationFrame(() => {
        element.style.height = height
      })
    },
    afterEnter(element) {
      requestAnimationFrame(() => {
        element.style.height = 'auto'
      })
      this.afterTransition()
    },
    leave(element) {
      const height = getComputedStyle(element).height
      element.style.height = height

      // Force repaint to make sure the
      // animation is triggered correctly.
      getComputedStyle(element).height // eslint-disable-line no-unused-expressions

      requestAnimationFrame(() => {
        element.style.height = 0
      })
    },
    afterLeave(element) {
      this.afterTransition()
    },
    afterTransition() {
      window.dispatchEvent(new CustomEvent("afterTransition"));
    }
  },
}
</script>

<style lang="scss" scoped>
* {
  will-change: height;
  transform: translateZ(0);
  backface-visibility: hidden;
  perspective: 1000px;
}

.expand-enter-active,
.expand-leave-active {
  overflow: hidden;
  transition: $extraslow-01 $expressive;
}
.expand-enter-active {
  transition-delay: $moderate-02;
}

.expand-enter,
.expand-leave-to {
  height: 0;
  opacity: 0;
  transform: scale(0.9);
  overflow: hidden;
}
</style>
