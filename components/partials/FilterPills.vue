<template>
  <transition-group
    tag="ul"
    name="staggered-fade"
    class="filter"
    :style="{ '--total': items.length }"
  >
    <li
      v-for="(item, i) in items"
      :key="item.name"
      :style="{'--i': i}"
      :class="{
        active: filter.includes(item[label]) || (filter.length === 0 && item[label] === 'all'),
      }"
      @click="toggleFilter(item[label])"
      v-html="item[value]"
    ></li>
  </transition-group>
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
    filterItems() {
      if (this.items.length === 0) return []
      const i = [...this.items]
      // i.push({label: '', value: ''})
      return i
    }
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

  --angle: 90deg;
  &::before, &::after {
    content: '';
    width: 1.25rem;
    height: 3em;
    position: absolute;
    background: linear-gradient(var(--angle), rgba(242, 242, 242, 0), var(--body-background) 70%);
    margin-top: 1rem;
    @include dynamic-box(margin, true, horizontal, false);
    transition: opacity $slow-02 $expressive;
  }

  &::before{
    left: 0;
    --angle: -90deg;
  }
  &::after{
    right: 0;
  }
  li {
    padding: 0.75rem 0;
    margin: 0 1rem;
    white-space: nowrap;
    cursor: pointer;
    &:first-child {
      margin-left: 0;
    }
    &:last-child {
      margin: 0rem;
      height: 1em;
      min-width: 0.1px;
    }
    &:hover,
    &.active:hover {
      color: $primary;
      background: none;
    }
    &.active {
      box-shadow: inset 0 -1px 0 -0.1px currentColor;
    }
  }
}
.staggered-fade {

  &-leave-active {
    transition: $slow-02 $productive;
    transition-delay: calc( #{$fast-01} * (var(--total) - var(--i)) );
  }

  &-enter-active {
    transition: $slow-02 $expressive;
    transition-delay: calc( #{$slow-01} + #{$fast-01} * var(--i) );
  }

  &-enter,
  &-leave-to {
    opacity: 0;
  }

  &-enter { transform: translateY(-20px); }
  &-leave-to { transform: translateY(0); }

}


</style>
