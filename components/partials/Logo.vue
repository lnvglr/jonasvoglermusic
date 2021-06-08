<template>
  <NuxtLink
		:to="{ name: 'Home' }"
		@click.native="
      $store.dispatch('setOpen', null)
    "
	>
      <!-- $store.dispatch('clearFilter'), -->
    <h1 class="logo">{{name}}</h1>
    <span v-if="description" class="subtitle">{{description}}</span>
  </NuxtLink>
</template>
<script>

export default {
  props: {
    name: String,
    description: String
  },
}
</script>

<style lang="scss" scoped>
  .logo {
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    line-height: 1;
    margin: 0;
  }
  .subtitle {
    font-size: 1rem;
    font-weight: normal;
    margin: nth(map-get($padding-sizes, medium), 1) 0;
    line-height: 1.2;
		letter-spacing: $letter-spacing;
  }
</style>
