<template>
  <div :class="page.slug + ' page-about'">
    <div class="page-body right-section">
      <p
        class="page-introduction"
        v-if="page.field.introduction && !experimental"
        v-html="introduction"
      ></p>
      <div v-if="page.content" class="page-content" v-html="page.content.rendered"></div>
    </div>
    <div class="left-section">
      <div class="about">
        <div v-if="thumbnail" ref="portrait" class="clipped portrait">
          <img
            :src="page.thumbnail['1536x1536'][0]"
            :alt="page.thumbnail.caption"
            :title="page.thumbnail.caption"
          />
        </div>
        <small v-if="page.thumbnail.caption" class="caption">{{ page.thumbnail.caption }}</small>
        <div class="contact">
          <Email v-if="page.field.email" :address="page.field.email" />
          <SocialMedia :links="page.field.social_media.map(e => e.url)" :initialDelay="2000" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SocialMedia from '@/components/partials/SocialMediaLinks.vue'
import Email from '@/components/partials/EmailAddress.vue'
import TransitionExpand from '@/components/partials/TransitionExpand.vue'

import { mapGetters } from 'vuex'

export default {
  name: 'PageAbout',
  components: {
    SocialMedia,
    Email,
    TransitionExpand,
  },
  props: {
    page: Object,
  },
  data() {
    return {
      thumbnail: this.page.thumbnail['cinema-large']
        ? this.page.thumbnail['cinema-large'][0]
        : false,
      introduction: this.page.field.introduction,
      content: this.page.content.rendered,
    }
  },
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
  },
  mounted() {
    this.$nextTick(function () {
      const body = document.querySelector('body')
      body.classList.add('template-' + this.page.field.template)

      this.introductionFadeIn()

      const self = this
      setTimeout(function () {
        self.$el.classList.remove('fade')
      }, 500)
    })
  },
  methods: {
    introductionFadeIn: function () {
      this.introduction = this.transformLetters(this.page.field.introduction, true)
    },
    transformLetters: function (text, delay = false) {
      const scopeId = this.$options._scopeId
      const duration = 1000
      const words = text.split(' ')
      let char = 0
      let transformedText = ''

      words.forEach(function (word) {
        const letters = word.split('')
        transformedText += `<span ${scopeId} class="word">`
        letters.forEach(function (letter) {
          const style = delay
            ? `style="transition-delay: ${(duration / text.length) * char}ms"`
            : ''
          transformedText += `<span ${scopeId} class="letter-container"><span ${scopeId} class="letter" ${style}>${letter}</span></span>`
          char++
        })
        transformedText += '</span> '
      })
      return transformedText
    },
  },
}
</script>

<style lang="scss" scoped>
.page-about {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row-reverse;
  justify-content: center;
  @include dynamic-box(margin, true);
  margin-top: 1rem;
  h1 {
    margin-top: 0;
  }
  .right-section {
    flex: 1 1 30%;
    @include dynamic-box(margin);
  }
  .left-section {
    flex: 0 1 30%;
    margin-right: auto;
    @include dynamic-box(margin);
  }
  .page-introduction {
    font-size: 2rem;
    font-weight: bold;
    text-transform: uppercase;
    margin: 1em 0;
    font-family: var(--font-family);
    line-height: 1.2;
    color: $secondary;

    &:first-child {
      margin-top: 0;
      padding-top: 0;
    }
    .word {
      display: inline-block;
      white-space: nowrap;
    }
    .letter-container {
      display: inline-block;
      overflow: hidden;
      .letter {
        position: relative;
        left: 0;
        transition: $slow-02 $expressive;
      }
    }
  }
  &.fade .page-introduction .letter-container .letter {
    left: -1em;
    opacity: 0;
  }
  .page-content {
    transition: $slow-02 $expressive;
    transition-delay: 1000ms;
    min-width: clamp(200px, 50vh, 300px);
  }
  &.fade .page-content {
    opacity: 0;
  }
  .about {
    z-index: 10;
    position: sticky;
    top: 2rem;
    min-width: clamp(200px, 30vh, 300px);
    max-width: min(40vh, 40vw);
    .portrait {
      margin-top: 0.5rem;
      margin-bottom: 2rem;
    }
  }
  .caption {
    color: $light-03;
    top: -1rem;
    position: relative;
    display: block;
    width: 100%;
    text-align: center;
    transition: $extraslow-01 $expressive;
  }
  &.fade .caption {
    opacity: 0;
  }
  .contact {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 -1rem 2rem;
    color: $dark-01;
    .mail {
      padding: 1rem;
      transition: $fast-02 $expressive;
      &:hover {
        color: $secondary;
      }
    }
    &::v-deep .icon-wrap {
      color: $light-03;
    }
  }

  &.fade .contact .mail {
    opacity: 0;
  }
  .portrait {
    transition: $extraslow-01 $expressive;
    border-radius: $border-radius-large;
  }
  &.fade {
    .portrait {
      width: 0;
      margin-left: 100%;
      img {
        left: 50%;
      }
    }
  }
  @media screen and (min-width: map-get($breakpoints, medium)) {
    .right-section {
      .page-introduction {
        font-size: 3rem;
      }
    }
  }
}
</style>
