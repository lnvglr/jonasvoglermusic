<template>
  <transition name="fade" mode="out-in">
    <component
      ref="page"
      class="page"
      :class="{
        fade: !this.fadedIn,
      }"
      :page="this.pageObject"
      :is="this.template"
    />
  </transition>
</template>

<script>
import { mapGetters } from 'vuex'

import PageDefault from '@/components/Page/PageDefault.vue'
import PageTable from '@/components/Page/PageTable.vue'
import PageAbout from '@/components/Page/PageAbout.vue'
import NotFound from '@/views/404.vue'

export default {
  name: 'Page',
  components: {
    PageDefault,
    PageTable,
    PageAbout,
    NotFound,
  },
  data() {
    return {
      fadedIn: false,
    }
  },
  computed: {
    // ...mapGetters({
    //   page: 'page/getPage',
    //   allPagesLoaded: 'page/allPagesLoaded',
    //   siteData: 'siteData',
    // }),
    pageObject() {
      const slug = this.$route.params.pageSlug
      const field = typeof slug === "number" ? "id" : "slug";
      return this.$store.state.page.pages.all.filter(page => page[field] === slug)[0];
      return this.page(this.$route.params.pageSlug)
    },
    template() {
      return this.pageObject ? 'page-' + this.pageObject.field.template : 'not-found'
    },
  },
  mounted() {
    this.$store.dispatch('page/getAllPages')
    this.$nextTick(function () {
      const self = this
      setTimeout(function () {
        // self.initialFadeIn();
        self.fadedIn = true
      }, 1000)
    })
  },
  methods: {
    initialFadeIn(event) {
      const hiddenElements = document.getElementsByClassName('hidden')
      const self = this
      if (!hiddenElements) return
      Array.from(hiddenElements).forEach(function (element) {
        if (self.isScrolledIntoView(element)) element.classList.remove('hidden')
      })
    },
    isScrolledIntoView(el) {
      const rect = el.getBoundingClientRect()
      const tolerance = rect.height - window.innerHeight / 10
      return rect.top + tolerance >= 0 && rect.bottom - tolerance <= window.innerHeight
    },
  },
  metaInfo() {
    const div = document.createElement('div')
      div.innerHTML = this.pageObject ? this.pageObject.content.rendered?.replace(/<[^>]*>?/gm, '') : ''
      const title = this.pageObject
        ? this.pageObject.title.rendered + ' – ' + this.$store.state.bloginfo.name
        : this.$store.state.bloginfo.name
      const description = this.pageObject
        ? this.pageObject.field.introduction
          ? this.pageObject.field.introduction
          : this.pageObject.content.rendered?.replace(/<[^>]*>?/gm, '')
        : this.$store.state.bloginfo.description
      return {
        title: title,
        meta: [
          {
            name: 'description',
            content: description,
          },
          {
            property: 'og:title',
            content: title,
          },
          {
            property: 'og:image',
            content: this.pageObject ? this.pageObject.thumbnail?.medium?.[0] : this.$store.state.bloginfo.favicon,
          },
          {
            property: 'og:url',
            content: this.pageObject ? this.pageObject.link : this.$store.state.bloginfo.url,
          },
        ],
      }
  },
}
</script>

<style lang="scss">
.page {
  margin-bottom: 25px;
  @media screen and (min-width: map-get($breakpoints, large)) {
    margin-bottom: 50px;
  }
  .page-content {
    * {
      transition: $extraslow-01 $expressive;
      position: relative;
      top: 0;
    }
    .hidden {
      top: 1em;
      opacity: 0;
    }
    a {
      color: $secondary;
      &:hover {
        text-decoration: underline;
      }
    }
    h1 {
      font-size: 2rem;
    }
    h2 {
      line-height: 1.3;
      font-size: 1.5rem;
    }
    h3 {
      font-size: 1.25rem;
    }
    h3,
    ul,
    ol,
    p {
      margin-top: 0;
    }
    ul,
    ol,
    p {
      font-family: $font-family-serif;
      line-height: 1.7;
      font-size: 1.5rem;
      color: $dark-02;
      &:last-child {
        margin-bottom: 0;
      }
    }
    @media screen and (min-width: map-get($breakpoints, medium)) {
      h1 {
        font-size: 2.5rem;
      }
      h2 {
        font-size: 1.75rem;
      }
      h3 {
        font-size: 1.5rem;
      }
      ul,
      ol,
      p {
        font-size: 1.75rem;
      }
    }
  }
}
</style>
