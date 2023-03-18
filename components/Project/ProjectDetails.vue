<template>
  <ul class="details" v-if="details">
    <li v-for="(detail, i) in details" :key="detail.value" :style="`--i: ${i}`" class="detail">
      <span class="detail-label">{{ detail.label }}</span>
      <span class="detail-value" v-html="detail.value.replace(/, /g, ',<wbr /> ')"></span>
      <wbr />
    </li>
  </ul>
</template>

<script>
export default {
  name: 'Details',
  props: {
    details: Array,
  },
}
</script>

<style lang="scss" scoped>
.details {
  display: block;
  flex-wrap: wrap;
  padding: 0;
  background: darken($light-01, 3);
  border-radius: $border-radius-large;
  margin-left: -2px;
  margin-right: -2px;
  padding: 1rem;
  text-align: center;
  line-height: 1.3;
  font-size: 0.75rem;
  .detail {
    display: inline-block;
    text-align: center;
    margin-right: 0.5rem;
    &, & > * {
      white-space: nowrap;
    }
    .detail-label {
      color: $dark-01;
      font-size: 0.625rem;
    }
  }
  @media screen and (max-width: map-get($breakpoints, medium)) {
    text-align: left;
    align-items: flex-start;
    display: flex;
    flex-direction: column;
    margin-left: -1.5rem;
    margin-right: -1.5rem;
    border-radius: 0;
    padding: 1.5rem;
    .detail {
      text-align: left;
      white-space: normal;
    }
  }
  @media screen and (min-width: map-get($breakpoints, large)) {
  .detail {
    
    .detail-label {
      font-size: 0.75rem;
    }
    .detail-value {
      font-size: 0.875rem;
    }
  }
  }
}
</style>
