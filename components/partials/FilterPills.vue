<template>
  <ul class="filter">
    <li
      v-for="(item, i) in items"
      :key="i"
      :class="{ active: filter.includes(item[label]) || (filter.length === 0 && item[label] === 'all') }"
      @click="toggleFilter(item[label])"
      v-html="item[value]"
    ></li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FilterPills',
  props: {
    items: Array,
    label: String,
    value: String,
  },
  methods: {
    toggleFilter(label) {
      this.$store.dispatch('changeRoute', '')
      this.$store.dispatch('updateFilter', label === 'all' ? null : label)
    },
  },
  computed: {
    ...mapGetters({
      filter: 'filter',
    }),
  },
}
</script>

<style lang="scss" scoped>
.filter {
  display: flex;
  list-style: none;
  font-size: 0.875rem;
  overflow-x: auto;
  padding: 0;
  @include dynamic-box($axis: horizontal);
  @include dynamic-box(margin, true, horizontal);
  // max-width: 100% !important;
  // width: 100% !important;

  // $box: padding, $negative: false, $axis: both
  li {
    white-space: nowrap;
    cursor: pointer;
    padding: 0.75rem 1rem;
    background: $light-02;
    border-radius: $border-radius-small;
    transition: $fast-02 $productive;
    letter-spacing: $letter-spacing;
    &:first-child {
      margin-left: -1rem;
    }
    & + * {
      margin-left: 0.5rem;
    }
    &:hover {
      background: darken($light-02, 5);
      transition: $fast-02 $productive;
    }
    &.active {
      background: $primary;
      color: white;
    }
    &.active:hover {
      background: darken($primary, 5);
    }
  }
}
</style>


<style lang="scss">
.experimental {
  .filter {
    &::before {
      content: '';
      background: linear-gradient(90deg, rgba(242, 242, 242, 0), $light-01 90%);
      width: 1.5rem;
      height: 3em;
      position: absolute;
      right: -1rem;
    }
    &::after {
      content: '';
      display: block;
      height: 1em;
      min-width: 1rem;
    }
    li {
      --shadow: -1px;
      letter-spacing: 0;
      border-radius: 0;
      padding: 0.75rem 0;
      margin: 0 1rem;
      background: none !important;
      &:first-child {
        margin-left: 0;
      }
      &:last-child {
        margin-right: 0rem;
      }
      &,
      &.active {
        color: inherit;
      }
      &:hover,
      &.active:hover {
        color: $primary;
        background: none;
      }
      &.active {
        box-shadow: inset 0 var(--shadow) 0 currentColor;
      }
    }
  }
}
</style>
