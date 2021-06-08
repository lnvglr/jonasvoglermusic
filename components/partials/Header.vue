<template>
  <header>
    <div class="wrap">
      <nav v-if="bloginfo">
        <Logo class="logo-wrap" :name="bloginfo.name" :description="bloginfo.description" />
        <ul class="pages">
          <li class="page-link">
            <NuxtLink
              :to="{ name: 'Home' }"
		          @click.native="
                $store.dispatch('setOpen', null)
              "
            >Projects</NuxtLink>
          </li>
          <!-- $store.dispatch('clearFilter'), -->
          <li v-for="page in pages('header')" :key="page.id" class="page-link">
            <NuxtLink :to="{ name: 'Page', params: { pageSlug: page.slug } }">
              {{ page.title.rendered }}</NuxtLink
            >
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
<script>
import Logo from './Logo.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  components: {
    Logo,
  },
  computed: {
    ...mapGetters({
      pages: 'pages/getPages',
      bloginfo: 'getBloginfo'
    }),
  }
}
</script>

<style lang="scss" scoped>
header {
  z-index: 10;
  .logo-wrap {
    white-space: nowrap;
    margin-right: auto;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 1em;
		.pages {
			white-space: nowrap;
			display: flex;
			list-style: none;
			margin: -0.5rem;
			padding: 0;
			li {
				margin: 0.5rem;
			}
		}
  }
}
.page-link {
  text-align: right;
	letter-spacing: $letter-spacing;
  a {
    line-height: 1.2;
  }
}
</style>
