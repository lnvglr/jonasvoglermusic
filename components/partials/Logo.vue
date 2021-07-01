<template>
  <div v-if="experimental">
    <span v-if="description" class="subtitle">{{ description }}</span>
    <NuxtLink
      :to="{ name: 'Home' }"
      @click.native="
        $store.dispatch('updateFilter', null), $store.dispatch('project/setOpen', null)
      "
    >
      <h1 class="logo">{{ name }}</h1>
    </NuxtLink>
  </div>
  <NuxtLink
    v-else
    :to="{ name: 'Home' }"
    @click.native="$store.dispatch('updateFilter', null), $store.dispatch('project/setOpen', null)"
  >
    <h1 class="logo">{{ name }}</h1>
    <span v-if="description" class="subtitle">{{ description }}</span>
  </NuxtLink>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    name: String,
    description: String,
  },
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
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
<style lang="scss">
.experimental {
  .subtitle {
    letter-spacing: 0;
  }
  h1.logo {
    font-size: clamp(1rem, 8vw, 500%);
    padding: 0.5em 0 0.3em;
    // color: var(--primary);
    border: 2px solid currentColor;
    margin: 0.1em 0;
    border-radius: 10px;
    font-family: var(--font-family-bold);
  }
}
</style>
