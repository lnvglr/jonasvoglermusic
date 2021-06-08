<template>
  <footer class="site-footer" v-if="bloginfo">
    <div class="wrap footer-wrap">
      <div v-for="page in pages('footer')" :key="page.id" class="page-link">
        <NuxtLink :to="{ name: 'Page', params: { pageSlug: page.slug } }" v-if="page.title">
          {{ page.title.rendered }}</NuxtLink
        >
      </div>
    </div>
    <div class="copyright">{{ date }} &copy; {{ bloginfo.name }}</div>
    <small class="credits"
      >This site was created by
      <a href="http://www.leonvogler.de" target="_blank">Leon Vogler</a>.</small
    >
    <client-only>
      <cookie-law
        message="This site uses cookies. If you continue to use the website, we will assume that you have given your consent."
        :buttonLink="{ name: 'Page', params: { pageSlug: 'privacy-policy' } }"
        :buttonLinkText="buttonLinkText"
        theme="custom"
      ></cookie-law>
    </client-only>
  </footer>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Footer',
  computed: {
    ...mapGetters({
      pages: 'pages/getPages',
      allPages: 'pages/getAllPages',
      bloginfo: 'getBloginfo',
    }),
    buttonLinkText() {
      return this.allPages?.find(page => page.slug === 'privacy-policy')?.title.rendered
    },
    date() {
      return new Date(this.bloginfo?.date * 1000).getFullYear()
    },
  },
}
</script>

<style lang="scss" scoped>
.site-footer {
  // margin-bottom: 66px; // player height
  line-height: 1.7;
  color: $dark-02;
  background: $light-02;
  padding: 25px 0;
  @media screen and (min-width: map-get($breakpoints, large)) {
    padding: 50px 0;
  }
  .footer-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  .copyright,
  .credits {
    text-align: center;
    color: $dark-01;
  }
  .credits {
    display: block;
    a:hover {
      color: $secondary;
    }
  }
  .page-link {
    margin: map-get($padding-sizes, medium) 0;
    white-space: nowrap;
		letter-spacing: $letter-spacing;
    a {
      padding: map-get($padding-sizes, medium);
    }
  }
}
</style>

<style lang="scss">
$primary: $secondary;
$primary-dark: darken($secondary, 10);
.Cookie--custom {
  background-color: white;
  color: $dark-01;
  gap: 1em;
  @include dynamic-box();
  & > * {
    margin: 0;
  }
  .Cookie__content {
    display: flex;
    align-items: center;
    line-height: 1.2;
    &:before {
      content: '🍪';
      display: block;
      font-size: 2em;
      margin-right: 1em;
    }
  }
  .Cookie__buttons {
    flex-direction: row;
    flex-wrap: wrap;
    flex: 1 0 auto;
    justify-content: flex-end;
  }
  .Cookie__button {
    font-family: $font-family;
    line-height: 1;
    white-space: nowrap;
    font-size: 1em;
    font-weight: normal;
    border-radius: $border-radius-small;
    padding: map-get($padding-sizes, medium);
    margin: map-get($padding-sizes, small);
  }
  a.Cookie__button {
    background-color: white;
    color: $primary;
    border: 1px solid currentColor;
    &:hover {
      color: $primary-dark;
    }
  }
  button.Cookie__button {
    background-color: $primary;
    color: white;
    border: 1px solid $primary;
    &:hover {
      background-color: $primary-dark;
      border-color: $primary-dark;
    }
  }
}
</style>
