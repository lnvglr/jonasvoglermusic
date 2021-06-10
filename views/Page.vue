<template>
<div>
  <transition name="fade" mode="out-in">
    <component
      ref="page"
      class="page"
      :class="{
        fade: !this.fadedIn,
      }"
      :page="this.page"
      :is="this.template"
    />
  </transition>
</div>
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
    ...mapGetters({
      getPage: 'pages/getPage',
      bloginfo: 'getBloginfo',
    }),
    page() {
      return this.getPage(this.$route.params.pageSlug)
    },
    template() {
      return this.page ? 'page-' + this.page.field.template : 'not-found'
    },
  },
  mounted() {
    this.$ga.page({
      page: this.$route.params.pageSlug,
      title: this.page?.title?.rendered,
      location: window.location.href
    })
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
      div.innerHTML = this.page ? this.page.content.rendered?.replace(/<[^>]*>?/gm, '') : ''
      const title = this.page
        ? this.page.title.rendered + ' – ' + this.bloginfo.name
        : this.bloginfo.name
      const description = this.page
        ? this.page.field.introduction
          ? this.page.field.introduction
          : this.page.content.rendered?.replace(/<[^>]*>?/gm, '')
        : this.bloginfo.description
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
            content: this.page ? this.page.thumbnail?.medium?.[0] : this.bloginfo.favicon,
          },
          {
            property: 'og:url',
            content: this.page ? this.page.link : this.bloginfo.url,
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
      /* These are technically the same, but use both */
      overflow-wrap: break-word;
      word-wrap: break-word;

      -ms-word-break: break-all;
      /* This is the dangerous one in WebKit, as it breaks things wherever */
      word-break: break-all;
      /* Instead use this non-standard one: */
      word-break: break-word;

      /* Adds a hyphen where the word breaks, if supported (No Blink) */
      -ms-hyphens: auto;
      -moz-hyphens: auto;
      -webkit-hyphens: auto;
      hyphens: auto;
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
