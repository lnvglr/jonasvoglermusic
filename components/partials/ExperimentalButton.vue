<template>
  <div
    class="button"
    :class="{ active: experimental }"
    @click="toggleExperimental"
    v-html="icon"
  ></div>
</template>

<script>
const icon = `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flask" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-flask fa-w-14 fa-3x"><path fill="currentColor" d="M437.2 403.5L320 215V64h8c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h8v151L10.8 403.5C-18.5 450.6 15.3 512 70.9 512h306.2c55.7 0 89.4-61.5 60.1-108.5zM137.9 320l48.2-77.6c3.7-5.2 5.8-11.6 5.8-18.4V64h64v160c0 6.9 2.2 13.2 5.8 18.4l48.2 77.6h-172z" class=""></path></svg>`

import { mapGetters } from 'vuex'

export default {
  name: 'ExperimentalButton',
  data() {
    return {
      icon: `<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="flask" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="svg-inline--fa fa-flask fa-w-14 fa-3x"><path fill="currentColor" d="M437.2 403.5L320 215V64h8c13.3 0 24-10.7 24-24V24c0-13.3-10.7-24-24-24H120c-13.3 0-24 10.7-24 24v16c0 13.3 10.7 24 24 24h8v151L10.8 403.5C-18.5 450.6 15.3 512 70.9 512h306.2c55.7 0 89.4-61.5 60.1-108.5zM137.9 320l48.2-77.6c3.7-5.2 5.8-11.6 5.8-18.4V64h64v160c0 6.9 2.2 13.2 5.8 18.4l48.2 77.6h-172z" class=""></path></svg>`,
    }
  },
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
  },
  methods: {
    toggleExperimental() {
      this.$store.dispatch('toggleExperimental')
    },
  },
}
</script>

<style lang="scss" scoped>
.button {
  background: #ffffff80;
  backdrop-filter: var(--blur);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--button-size-large);
  height: var(--button-size-large);
  transition: $moderate-02 $expressive;
  margin: 0 auto;
  color: $dark-02;
  // @include dynamic-box(margin);
  &:hover {
    transform: scale(0.95);
    color: var(--primary);
  }
  &:active {
    transform: scale(0.9);
    transition-duration: 0ms;
  }
  &.active {
    color: $white;
    background: var(--primary);
    transition: $moderate-02 $expressive;
  }
  &::v-deep svg {
    width: calc( var(--button-size-large) / 3 );
    height: calc( var(--button-size-large) / 3 );
  }
}
</style>
