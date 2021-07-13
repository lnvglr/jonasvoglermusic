<template>
  <div class="share" @click="share()" v-if="show"><i class="share-button"></i></div>
</template>

<script>
export default {
  name: 'ShareButton',
  props: {
    project: {
      type: Object,
    },
  },
  computed: {
    show() {
      return navigator.share
    }
  },
  methods: {
    share() {
      navigator
        .share({
          title: this.project.title.rendered,
          text: this.project.title.rendered,
          url: this.project.link,
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.share {
  --shadow-opacity: 0.1;
  cursor: pointer;
  color: $white;
  position: absolute;
  right: 0;
  z-index: 300;
  width: 30px;
  height: 30px;
  @include dynamic-box(padding);
  @include dynamic-box(margin, $axis: vertical);
  @include dynamic-box(margin, true, horizontal, false);
  box-sizing: content-box;
  background: radial-gradient(
    circle,
    rgba(0, 0, 0, var(--shadow-opacity)) 0%,
    rgba(0, 0, 0, calc(var(--shadow-opacity) / 4)) 40%,
    rgba(0, 0, 0, 0) 60%
  );
  transition: $slow-02 $expressive;
  fill: currentColor;

  &.fade-enter-active,
  &.fade-leave-active {
    transition: $moderate-02 $productive;
    transition-property: transform opacity margin;

    .share-button {
      &, &::after, &::before {
        transition: $slow-02 $expressive $moderate-02;
      }
      &::after {
        transition-delay: $slow-01;
      }
    }
  }
  &.fade-enter,
  &.fade-leave-to {
    margin-right: 0;
    .share-button {
      --arrow-offset: -0.25;
      --arrow-length: 0.5;
      --arrow-head: 0.25;
      &::before, &::after {
        opacity: 0;
      }
    }
  }

  &:hover .share-button {
    --arrow-offset: 1.5;
      --arrow-head: 1.25;
  }
  .share-button, &:hover .share-button{
    &, &::after, &::before {
      transition: $moderate-02 $expressive;
    }
  }
}
.share-button {
  --arrow-offset: 1;
  --arrow-length: 1;
  --arrow-head: 1;
  position: relative;
  font-size: 1rem;
  width: 1.5em;
  height: 1.2em;
  display: block;
  top: 0.5em;
  border-radius: 0 0 0.25em 0.25em;
  box-shadow:
    inset var(--stroke) 0 0 currentcolor,
    inset 0 calc(-1 * var(--stroke)) 0 currentcolor,
    inset calc(-1 * var(--stroke)) 0 0 currentcolor,
    inset calc(0.625 * var(--stroke)) calc(-0.625 * var(--stroke)) 0 currentcolor,
    inset calc(-0.625 * var(--stroke)) calc(-0.625 * var(--stroke)) 0 currentcolor;

  &::before {
    content: '';
    width: var(--stroke);
    height: calc(1em * var(--arrow-length));
    background: currentcolor;
    position: absolute;
    display: block;
    left: 50%;
    transform: translate(calc(var(--stroke) / -2), calc(var(--arrow-offset) * -0.4em));
  }
  &::after {
    content: '';
    width: calc(0.5em * var(--arrow-head));
    height: calc(0.5em * var(--arrow-head));
    position: absolute;
    display: block;
    left: 50%;
    top: calc((var(--arrow-offset) * -0.4em) - var(--stroke));
    box-shadow: inset var(--stroke) var(--stroke) 0 currentcolor;
    transform: rotate(45deg) translate(0, 0);
    transform-origin: 0 0;
  }
}
</style>
