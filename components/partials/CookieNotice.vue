<template>
  <div>
    <cookie-law
      ref="cookies"
      message="This site uses cookies. If you continue to use the website, we will assume that you have given your consent."
      :buttonLink="{ name: 'Page', params: { pageSlug: privacySlug } }"
      :buttonLinkText="buttonLinkText"
      :buttonDecline="true"
      buttonDeclineClass="Cookie__button"
      buttonDeclineText="Only functional cookies"
      transitionName="fade"
      @accept="accept"
      @decline="decline"
      theme="custom"
    ></cookie-law>
    <button
      v-if="isPrivacyPage && cookieConsent !== null"
      @click="revoke"
      class="Cookie__button Cookie__button--revoke primary"
    >
      Revoke Cookie Preferences
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bootstrap } from 'vue-gtag'

export default {
  name: 'CookieNotice',
  data() {
    return {
      privacySlug: 'privacy-policy',
      ignoreWatcher: false,
    }
  },
  computed: {
    ...mapGetters({
      page: 'pages/getPage',
      cookieConsent: 'getCookieConsent',
    }),
    buttonLinkText() {
      return this.page(this.privacySlug)?.title.rendered
    },
    isPrivacyPage() {
      return this.$nuxt.$route.params.pageSlug === this.privacySlug
    },
  },
  methods: {
    accept() {
      this.$store.dispatch('setCookieConsent', true)
      bootstrap().then((gtag) => {})
    },
    decline() {
      this.$store.dispatch('setCookieConsent', false)
    },
    revoke() {
      this.$refs.cookies.revoke()
      this.$store.dispatch('setCookieConsent', null)
    },
    blockedIframes(string) {
      if (this.cookieConsent) return string
      const iframeRegex = /(?:<iframe.*?src=["'])(.*?)(?:["'])(?:.*>.*?<\/iframe>)/g;
      return string.replace(iframeRegex, (_, src) => this.blockedCookies(src))
    },
    blockedCookies(url = null) {
      const link =
        url && this.isValidHttpUrl(url)
          ? `<a class="Cookie__button secondary" target="_blank" href="${url}">Open ${new URL(url).hostname}</a>`
          : ''
      return `<div class="allow-cookie-notice">
        <span>External content blocked.</span>
        <span>${link}<button class="Cookie__button primary allow-cookies">Allow cookies</button></span>
      </div>`
    },
    isValidHttpUrl(string) {
      let url

      try {
        url = new URL(string)
      } catch (_) {
        return false
      }

      return url.protocol === 'http:' || url.protocol === 'https:'
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.$store.dispatch('setCookieConsent', this.$refs.cookies.isAccepted())
    })
    const self = this
    document.addEventListener('click', function (e) {
      if (e.target.classList.contains('allow-cookies')) {
        self.$refs.cookies.accept()
        e.stopPropagation()
      }
    })
  },
}
</script>
<style lang="scss">
$primary: $secondary;
$primary-dark: darken($secondary, 10);
.Cookie--custom {
  background-color: white;
  color: $dark-01;
  flex-flow: column !important;
  width: initial !important;
  max-width: $narrow;
  border-radius: $border-radius-large;
  @include dynamic-box();
  @include dynamic-box(margin);
  @media screen and (max-width: map-get($breakpoints, large)) {
    margin: 0;
    border-radius: 0;
  }
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
    width: 100%;
    & > * {
      margin: 0;
      margin-top: 1rem;
      text-align: center;
      &:nth-child(1) {
        margin-left: -#{nth(map-get($padding-sizes, medium), 2)};
      }
      & + * {
        margin-left: 1rem;
      }
      @media screen and (max-width: map-get($breakpoints, medium)) {
        width: 100%;
        margin-left: 0 !important;
        margin-right: 0 !important;
      }
    }
  }

  &.fade-enter,
  &.fade-leave-to {
    transform: scale(0.9) translateY(100%);
  }
}
.Cookie__button {
  font-family: var(--font-family);
  line-height: 1;
  white-space: nowrap;
  font-size: 1em;
  font-weight: normal;
  border-radius: $border-radius-small;
  padding: map-get($padding-sizes, medium);
  margin: map-get($padding-sizes, small);
  .Cookie__buttons &:nth-child(1) {
    background-color: white;
    color: $primary;
    border: 1px solid transparent;
    margin-right: auto;
    &:hover {
      color: $primary-dark;
    }
  }
  &.secondary,
  .Cookie__buttons &:nth-child(2) {
    background-color: transparent;
    color: currentColor;
    border: 1px solid currentColor;
    &:hover {
      background-color: transparent;
    }
  }
  &.primary,
  .Cookie__buttons &:nth-child(3) {
    background-color: $primary;
    color: white;
    border: 1px solid $primary;
    &:hover {
      color: white;
      background-color: $primary-dark;
      border-color: $primary-dark;
    }
  }
}
.Cookie__button--revoke {
  position: fixed;
  bottom: 0;
  left: 0;
  @include dynamic-box(margin);
}

.allow-cookie-notice {
  display: flex;
  flex-direction: column;
  background: darken($light-01, 3);
  font-size: 0.875rem;
  font-family: var(--font-family);
  padding: 2rem;
  margin-bottom: 1rem;
  border-radius: $border-radius-large;
  text-align: center;
  align-items: center;
  justify-content: center;
  a {
    display: inline-block;
    &:hover {
      text-decoration: none !important
    }
  }
  span:first-child {
    margin-bottom: 1rem;
  }
}

.project .cookie-consent {
  --scale: 0.9;
  z-index: 2;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  background: #00000000;
  backdrop-filter: blur(0px) saturate(1);
  transition: all $moderate-02;
  border-radius: $border-radius-large;
  color: transparent;
  .allow-cookie-notice {
    background: transparent;
    opacity: 0;
    transition: all $moderate-02;
    margin-bottom: 0;
  }
}
.clipped:hover {
  .cookie-consent {
    backdrop-filter: var(--blur);
    background: #00000080;
    color: inherit;
    .allow-cookie-notice {
      opacity: 1;
      transition: all $moderate-02;
    }
    transition: all $moderate-02;
  }
}
</style>
