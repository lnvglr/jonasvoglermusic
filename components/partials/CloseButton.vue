<template>
	<div class="close" @click="$emit('click')"></div>
</template>

<script>
export default {
  name: 'CloseButton',
}
</script>

<style lang="scss" scoped>
  .close {
    cursor: pointer;
    color: $white;
    padding: 5px;
    margin: 0;
    position: absolute;
    left: 0;
    width: 30px !important;
    height: 30px !important;
    z-index: 300;
    @include dynamic-box(padding);
    @include dynamic-box(margin, $axis: vertical);
    @include dynamic-box(margin, true, horizontal);
    transition: $moderate-02 $expressive;
    &,
    &::before,
    &::after {
      will-change: margin, opacity, transform, width;
      transform: translateZ(0);
      backface-visibility: hidden;
      perspective: 1000px;
    }
    &::before,
    &::after {
      content: '';
      display: block;
      height: var(--stroke);
      width: 30px;
      position: absolute;
      background-color: currentColor;
    }
    &::before {
      transform: translate(0, 14px) rotate(-45deg);
    }
    &::after {
      transform: translate(0, 14px) rotate(45deg);
    }
    &:hover {
      color: $light-03;
      transition: $moderate-02 $expressive;
    }

    &.fade-enter-active,
    &.fade-leave-active {
      &,
      &::before,
      &::after {
        transition: $moderate-02 $productive;
        transition-property: transform opacity margin;
      }
    }
    &.fade-enter,
    &.fade-leave-to {
      margin-left: 0;
      &::before {
        transform: translate(0, 7px) rotate(0);
      }
      &::after {
        transform: translate(0, 20px) rotate(0);
      }
    }
  }
</style>
