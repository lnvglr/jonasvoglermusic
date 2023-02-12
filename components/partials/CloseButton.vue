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
  --shadow-opacity: 0.1;
  cursor: pointer;
  color: $white;
  position: absolute;
  left: 0;
  z-index: 300;
  width: 30px;
  height: 30px;
  @include dynamic-box(padding);
  @include dynamic-box(margin, $axis: vertical);
  @include dynamic-box(margin, true, horizontal, false);
  box-sizing: content-box;
  transition: $moderate-02 $expressive;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, var(--shadow-opacity)) 0%,
    rgba(0, 0, 0, calc(var(--shadow-opacity) / 4)) 40%,
    rgba(0, 0, 0, 0) 60%
  );
  transition: $slow-02 $expressive;
  &,
  &::before,
  &::after {
    will-change: margin, opacity, transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  &::before,
  &::after {
    --translate-stroke: 0, 14px;
    --rotate-stroke: 45deg;
    content: '';
    height: var(--stroke);
    width: 30px;
    position: absolute;
    background-color: currentColor;
    transition: $slow-02 $expressive;
    transform: translate(var(--translate-stroke)) rotate(var(--rotate-stroke));
  }
  &::before {
    --rotate-stroke: -45deg;
  }
  &:hover {
    &::before,
    &::after {
      transition: $moderate-02 $expressive;
    }
    &::before {
      --rotate-stroke: 45deg;
    }
    &::after {
      --rotate-stroke: 135deg;
    }
  }

  &.slide-in-enter-active,
  &.slide-in-leave-active {
    & {
      transition: $moderate-02 $productive;
      transition-property: transform opacity margin;
    }
    &::before,
    &::after {
      transition: transform $slow-02 $productive;
    }
  }
  &.slide-in-enter,
  &.slide-in-leave-to {
    margin-left: 0;
    &::before,
    &::after {
      --rotate-stroke: -90deg;
    }
    &::before {
      --translate-stroke: 7px, 0;
    }
    &::after {
      --translate-stroke: 21px, 0;
    }
  }
}
</style>
