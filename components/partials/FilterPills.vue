<template>
  <ul class="filter">
    <li
      v-for="(item, i) in items"
      :key="i"
      :class="{ active: filter.includes(item[label]) }"
      @click="toggleFilter(item[label])"
    >
      {{ item[value] }}
    </li>
  </ul>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'FilterPills',
  props: {
    items: Array,
    label: String,
    value: String
  },
  methods: {
    toggleFilter(label) {
      this.$store.dispatch('updateFilter', label)
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
  padding: 0;
  flex-wrap: wrap;
  margin: -5px;

  li {
    white-space: nowrap;
    cursor: pointer;
    margin: 0.5rem;
    padding: 0.75rem 1rem;
    background: $light-02;
    border-radius: $border-radius-small;
    transition: $fast-02 $productive;
    letter-spacing: $letter-spacing;
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
