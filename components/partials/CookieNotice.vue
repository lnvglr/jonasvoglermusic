<template>
  <div>
    <cookie-law
      ref="cookies"
      :message="message"
      :buttonLink="privacySlug"
      :buttonLinkText="buttonLinkText"
      :buttonDecline="true"
      buttonText="Accept all"
      buttonDeclineClass="Cookie__button"
      buttonDeclineText="Accept functional"
      transitionName="fade"
      @accept="accept"
      @decline="decline"
      theme="custom"
    ></cookie-law>
    <transition name="slide-in">
      <button
        v-if="isPrivacyPage && cookieConsent !== null"
        @click="revoke"
        class="Cookie__button Cookie__button--revoke alert"
      >
        Revoke Cookie Preferences
      </button>
    </transition>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "CookieNotice",
  data() {
    return {
      privacySlug: "privacy-policy",
      ignoreWatcher: false,
    };
  },
  computed: {
    ...mapGetters({
      page: "pages/getPage",
      cookieConsent: "getCookieConsent",
    }),
    buttonLinkText() {
      return this.page(this.privacySlug)?.title.rendered;
    },
    isPrivacyPage() {
      return this.$nuxt.$route.params.slug === this.privacySlug;
    },
    message() {
      return `This site uses cookies. By accepting, you allow their use. You can change your decision later in our ${this.buttonLinkText}.`;
    },
  },
  methods: {
    accept() {
      // Accept all: functional + tracking
      this.$store.dispatch("setCookieConsent", true);
      this.$store.dispatch("setCookieTrackingConsent", true);
      if (process.client) {
        const id = window.GTAG_ID || window.__GTAG_ID__;
        if (id) window[`ga-disable-${id}`] = false;
        console.log("accept", id, window[`ga-disable-${id}`]);
        try {
          // Inform gtag consent API per GA4 guidance
          if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
          }
        } catch(_) {}
      }
    },
    decline() {
      // Only functional cookies: allow embeds but disable tracking
      this.$store.dispatch("setCookieConsent", true);
      this.$store.dispatch("setCookieTrackingConsent", false);
      if (process.client) {
        const id = window.GTAG_ID || window.__GTAG_ID__;
        if (id) window[`ga-disable-${id}`] = true;
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
          }
        } catch(_) {}
      }
    },
    revoke() {
      this.$refs.cookies.revoke();
      this.$store.dispatch("setCookieConsent", null);
      this.$store.dispatch("setCookieTrackingConsent", null);
      if (process.client) {
        const id = window.GTAG_ID || window.__GTAG_ID__;
        if (id) window[`ga-disable-${id}`] = true;
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('consent', 'update', {
              analytics_storage: 'denied',
              functionality_storage: 'denied',
              security_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
          }
        } catch(_) {}
      }
    },
    blockedIframes(string) {
      if (this.cookieConsent) return string;
      const iframeRegex =
        /(?:<iframe.*?src=["'])(.*?)(?:["'])(?:.*>.*?<\/iframe>)/g;
      return string.replace(iframeRegex, (_, src) => this.blockedCookies(src));
    },
    blockedCookies(url = null) {
      const link =
        url && this.isValidHttpUrl(url)
          ? `<a class="Cookie__button secondary" target="_blank" href="${url}">Open ${
              new URL(url).hostname
            }</a>`
          : "";
      return `<div class="allow-cookie-notice">
        <span>External content blocked.</span>
        <span>${link}<button class="Cookie__button success allow-cookies">Allow cookies</button></span>
      </div>`;
    },
    isValidHttpUrl(string) {
      let url;

      try {
        url = new URL(string);
      } catch (_) {
        return false;
      }

      return url.protocol === "http:" || url.protocol === "https:";
    },
  },
  mounted() {
    this.$nextTick(function () {
      // Map vue-cookie-law's binary state to our two-tier consent
      const accepted = this.$refs.cookies.isAccepted() || localStorage.getItem('cookie:accepted') === 'true';
      if (accepted) {
        this.$store.dispatch("setCookieConsent", true);
        this.$store.dispatch("setCookieTrackingConsent", true);
        const id = window.GTAG_ID || window.__GTAG_ID__;
        if (id) window[`ga-disable-${id}`] = false;
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('consent', 'default', {
              analytics_storage: 'granted',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
          }
        } catch(_) {}
      } else {
        this.$store.dispatch("setCookieConsent", true);
        this.$store.dispatch("setCookieTrackingConsent", false);
        const id = window.GTAG_ID || window.__GTAG_ID__;
        if (id) window[`ga-disable-${id}`] = true;
        try {
          if (typeof window.gtag === 'function') {
            window.gtag('consent', 'default', {
              analytics_storage: 'denied',
              functionality_storage: 'granted',
              security_storage: 'granted',
              ad_storage: 'denied',
              ad_user_data: 'denied',
              ad_personalization: 'denied',
            });
          }
        } catch(_) {}
      }
    });
    const self = this;
    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("allow-cookies")) {
        self.$refs.cookies.accept();
        e.stopPropagation();
      }
    });
  },
};
</script>
<style lang="scss">
$primary: $secondary;
$primary-dark: darken($secondary, 10);
$success-dark: darken($success, 10);
$alert-dark: darken($alert, 10);
$button-padding: map-get($button-sizes, medium);
.Cookie--custom {
  background-color: white;
  color: $dark-01;
  flex-flow: column !important;
  width: initial !important;
  max-width: map-get($breakpoints, large);
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
    margin-bottom: 1rem;
    &:before {
      content: "🍪";
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
        margin-left: -#{nth($button-padding, 2)};
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
  padding: $button-padding;
  margin: map-get($padding-sizes, medium);

  .Cookie__buttons &:nth-child(1) {
    margin-right: auto;
  }
  &.secondary,
  .Cookie__buttons &:nth-child(1),
  .Cookie__buttons &:nth-child(2) {
    background-color: white;
    color: $dark-01;
    border: 1px solid transparent;
    &:hover {
      color: $black;
    }
  }
  &.secondary,
  .Cookie__buttons &:nth-child(2) {
    border: 1px solid currentColor;
    &:hover {
      background-color: initial;
    }
  }
  &.success,
  .Cookie__buttons &:nth-child(3) {
    background-color: $success;
    color: white;
    border: 1px solid $success;
    &:hover {
      color: white;
      background-color: $success-dark;
      border-color: $success-dark;
    }
  }
  &.alert {
    background-color: $alert;
    color: white;
    border: 1px solid $alert;
    &:hover {
      color: white;
      background-color: $alert-dark;
      border-color: $alert-dark;
    }
  }
}
.Cookie__button--revoke {
  position: fixed;
  bottom: 0;
  left: 0;
  @include dynamic-box(margin);
  &.fade-enter-active {
    transition-delay: $slow-01;
  }
}
@media screen and (pointer: coarse), (pointer: none) {
  .Cookie__button {
    border-radius: $border-radius-large;
    padding: map-get($button-sizes, large);
  }
  .Cookie__button--revoke {
    $margin: map-get($padding-sizes, xxlarge);
    width: 320px;
    max-width: calc(100% - #{$margin} * 2);
    margin: $margin;
  }
}

.allow-cookie-notice {
  display: flex;
  flex-direction: column;
  color: $dark-02;
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
      text-decoration: none !important;
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
