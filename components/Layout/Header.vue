<template>
  <header>
    <div class="wrap">
      <nav v-if="bloginfo">
        <Logo class="logo-wrap" :name="bloginfo.name" :description="bloginfo.description" />
        <ul class="pages">
          <li class="page-link">
            <NuxtLink
              to="/"
              @click.native="
                $store.dispatch('updateFilter', null), $store.dispatch('project/setOpen', null)
              "
              >Projects</NuxtLink
            >
          </li>
          <li v-for="page in pages('header')" :key="page.id" class="page-link">
            <NuxtLink :to="page.slug">
              {{ page.title.rendered }}
            </NuxtLink>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>
<script>
import Logo from '@/components/Layout/Logo.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'Header',
  components: {
    Logo,
  },
  computed: {
    ...mapGetters({
      pages: 'pages/getPages',
      bloginfo: 'getBloginfo',
    }),
  },
}
</script>

<style lang="scss" scoped>
header {
  z-index: 10;
  position: relative;
  .logo-wrap {
    white-space: nowrap;
    margin-right: auto;
  }
  nav {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    flex-wrap: wrap;
    margin-top: 1rem;
    .pages {
      white-space: nowrap;
      display: flex;
      overflow-x: auto;
      list-style: none;
      margin: -1rem;
      padding: 0;
      li {
        margin: 1rem;
      }
    }
  }
}
.page-link {
  text-align: right;
  a {
    line-height: 1.2;
  }
  &.active {
    color: var(--primary);
  }
}
</style>

<style lang="scss">
.experimental {
  header {
    .logo-wrap {
      display: flex;
      width: 100%;
      white-space: initial;
      flex-direction: column;
      order: 2;
      margin-top: 2rem;
    }
  }
}
</style>
