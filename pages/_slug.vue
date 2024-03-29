<template>
  <component
    ref="page"
    class="page"
    :class="{
      fade: !fadedIn,
    }"
    :ready="fadedIn"
    :page="page"
    :is="template"
  />
</template>

<script>
import { mapGetters } from 'vuex'

import PageDefault from '@/components/Page/PageDefault.vue'
import PageTable from '@/components/Page/PageTable.vue'
import PageAbout from '@/components/Page/PageAbout.vue'
import NotFound from '@/layouts/error.vue'

import CookieNotice from '@/components/partials/CookieNotice.vue'

export default {
  name: 'Page',
  // transition: 'fade',
  transition(to, from, e) {
    if (from && from.params?.slug === 'music') {
      return 'fade'
    }
    return 'slide-in'
  },
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
      cookieConsent: 'getCookieConsent',
    }),
    page() {
      const page = this.getPage(this.$route.params.slug)
      if (!page) return
      const pageObject = JSON.parse(JSON.stringify(page))
      if (this.cookieConsent) return pageObject
      pageObject.content.rendered = CookieNotice.methods.blockedIframes(pageObject.content.rendered)
      return pageObject
    },
    template() {
      return this.page ? 'page-' + this.page.field.template : 'not-found'
    },
  },
  mounted() {
    this.$nextTick(() => setTimeout(() => this.fadedIn = !0, 200))
  },
  methods: {
    initialFadeIn() {
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
    if (!this.bloginfo) return
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
  h1 {
    font-size: 1.5rem;
    @media screen and (min-width: map-get($breakpoints, medium)) {
      font-size: 2.5rem;
    }
  }
  .page-content {
    hr {
      width: 100px;
      margin: 0 auto;
      @include dynamic-box(margin, $axis: vertical);
      border: none;
      border-bottom: var(--stroke) solid $light-02;
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
      font-size: 1.5rem;
    }
    h2 {
      line-height: 1.3;
      font-size: 1.25rem;
    }
    h3 {
      font-size: 1.125rem;
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
      font-size: 1.125rem;
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
    iframe {
      max-width: 100%;
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
        font-size: 1.5rem;
      }
    }
  }
}
</style>
