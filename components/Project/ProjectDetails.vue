<template>
  <ul class="details">
    <li v-for="(detail, i) in details" :key="detail.value" :style="`--i: ${i}`" class="detail">
			<span class="detail-label">{{ detail.label }}</span>
			<span class="detail-value" v-html="detail.value.replace(/, /g,',<br />')"></span>
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
  display: flex;
  margin: 1rem -1rem;
  flex-wrap: wrap;
	padding: 0;
  background: darken($light-01, 3);
  border-radius: $border-radius-large;
  margin: 1rem -2px;
  padding: 0.5rem;
  .detail {
		display: flex;
		flex-direction: column;
    margin: 0.5rem 1rem;
    flex: 0 1 auto;
    .detail-label {
      margin: 0;
      color: $dark-01;
      font-size: 0.75rem;
      letter-spacing: $letter-spacing;
    }
    .detail-value {
      margin: 0;
      font-size: 1rem;
      font-weight: bold;
      line-height: 1.2;
    }
  }
	@media screen and (min-width: map-get($breakpoints, large)) {
		padding: 1rem;
		.detail {
			.detail-label {
				font-size: 0.875rem;
			}
			.detail-value {
				font-size: 1.125rem;
			}
		}
	}
}
</style>
