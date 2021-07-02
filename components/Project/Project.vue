<template>
  <section
    ref="projectContainer"
    class="project"
    :class="{
      fade: !fadedIn && !phantom,
      active: isOpen,
      idle: isAppIdle && isOpen && heroIsVideo && isPlaying,
    }"
  >
    <transition name="fade">
      <CloseButton class="element" v-if="isOpen" @click="close" />
    </transition>
    <div class="project-header" ref="projectHeader" :class="{ hasControls: heroIsVideo }">
      <div v-if="phantom" :style="`padding-bottom: ${aspectRatio}%;`"></div>
      <div
        v-else
        class="clipped cinema"
        :style="`padding-bottom: ${aspectRatio}%;`"
        ref="projectThumbnail"
        @click="open(project.slug)"
      >
        <!-- :style="`--aspect-ratio: ${aspectRatio}%;`" -->
        <div class="content">
          <component :is="isOpen ? 'h2' : 'span'" class="title-container">
            <span v-if="projectSubtitle" class="project-category" v-html="projectSubtitle"></span>
            <span class="project-title">{{ project.title.rendered }}</span>
          </component>
          <FestivalContainer :festivals="headerFestivals" class="hide-medium-down" :small="true" />
        </div>
        <ProjectHero class="hero" :open="isOpen" :project="project" @playing="e => isPlaying = e" />
      </div>
    </div>
    <transition-expand :scrollReference="offset">
      <div v-if="isOpen" class="dynamic-container">
        <div class="project-content">
          <div v-html="description" class="project-description"></div>
          <ProjectDetails :details="project.field.details" />
          <FestivalContainer :festivals="project.field.festivals" class="alignfull" />
          <div v-html="gallery" class="project-gallery"></div>
          <!-- <SocialSharing :project="project" /> -->
        </div>
      </div>
    </transition-expand>
  </section>
</template>

<script>
import _ from 'lodash'
import { mapGetters } from 'vuex'

import TransitionExpand from '@/components/partials/TransitionExpand.vue'
import CloseButton from '@/components/partials/CloseButton.vue'
import SocialSharing from '@/components/partials/SocialSharing.vue'

import ProjectHero from '@/components/Project/ProjectHero.vue'
import ProjectDetails from '@/components/Project/ProjectDetails.vue'
import FestivalContainer from '@/components/Project/FestivalContainer.vue'

export default {
  name: 'Project',
  components: {
    CloseButton,
    SocialSharing,
    ProjectDetails,
    ProjectHero,
    FestivalContainer,
    TransitionExpand,
  },
  props: {
    project: Object,
    isOpen: Boolean,
    phantom: Boolean,
    reference: [Object, Array],
    index: Number,
  },
  data() {
    return {
      cinemaScope: 0.4189,
      scale: 1 / 0.95,
      isLoaded: false,
      fadedIn: false,
      offset: null,
      description: null,
      gallery: null,
      isPlaying: false
    }
  },
  computed: {
    ...mapGetters({
      filter: 'filter',
      experimental: 'getExperimental',
    }),
    offsetTop() {
      return this.$el ? this.$el.offsetTop : this.element
    },
    projectSubtitle() {
      const details = [
        this.project.field?.genre?.name,
        this.project.field?.details.length > 0
          ? this.project.field?.details.find((e) => e.label.toLowerCase().includes('year'))?.value
          : '',
      ]
      return details
        .filter((e) => e !== null)
        .map((e) => `<span>${e}</span>`)
        .join('<span class="sr-only">,</span><span class="em-space"> </span>')
        .concat('<span class="sr-only">:</span>')
    },
    heroIsVideo() {
      return ['vimeo', 'youtube', 'video_local'].includes(this.project.field?.hero?.type)
    },
    headerFestivals() {
      if (!this.project.field?.festivals) return
      return this.project.field.festivals.filter((e) => e.show_in_header)
    },
    aspectRatio() {
      const ratioTmp =
        this.isOpen && this.project.field?.hero ? this.project.field?.hero?.ratio : ''
      switch (ratioTmp) {
        case '21_9': {
          return 41.89
        }
        case '16_9': {
          return 56.25
        }
        case '4_3': {
          return 75
        }
        case 'custom': {
          if (
            !this.project.field?.hero?.custom_ratio.num ||
            !this.project.field?.hero?.custom_ratio.den
          ) {
            break
          }
          const ratio = this.reduce(
            this.project.field?.hero?.custom_ratio.num,
            this.project.field?.hero?.custom_ratio.den
          )
          return (100 / ratio[0]) * ratio[1]
        }
        default: {
          return this.cinemaScope * 100
        }
      }
    },
  },
  mounted() {
    this.$nextTick(function () {
      // Init
      this.calculateOffset(this.isOpen)
      this.init()
      this.setupGallery(this.isOpen)
    })

    window.addEventListener('resize', _.throttle(this.calculateOffset, 100))
    window.addEventListener('resize', _.throttle(this.initialFadeIn, 100))
    window.addEventListener('scroll', _.throttle(this.initialFadeIn, 30))
    window.addEventListener('touchmove', _.throttle(this.initialFadeIn, 30))

  },
  unmounted() {
    window.removeEventListener('resize', _.throttle(this.calculateOffset, 100))
    window.removeEventListener('resize', _.throttle(this.initialFadeIn, 100))
    window.removeEventListener('scroll', _.throttle(this.initialFadeIn, 30))
    window.removeEventListener('touchmove', _.throttle(this.initialFadeIn, 30))
  },
  methods: {
    setupGallery(open = true) {
      if (!open || (this.gallery && this.description)) return
      const removeElements = (elms) => elms.forEach((el) => el.remove())
      const content = this.project.content.rendered
      const div = document.createElement('div')
      div.innerHTML = content
      const gallery = div.querySelectorAll('.wp-block-gallery')
      this.gallery = [...gallery][0]?.outerHTML
      removeElements(gallery)
      this.description = div.innerHTML.replace(/<p><\/p>/gi, '').replace(/(<br>\s*)+$/,'')
    },
    close() {
      this.$store.dispatch('changeRoute', null)
      this.$emit('close')
      // window.scrollBy({
      //   top: -50,
      //   behavior: 'smooth',
      // })
    },
    open(slug) {
      this.setupGallery()
      this.$store.dispatch('changeRoute', slug)
      this.$emit('open', slug)
    },
    init() {
      const self = this
      const initialDelay = 200
      const waterfallInterval = 100
      setTimeout(function () {
        self.initialFadeIn()
      }, initialDelay + waterfallInterval * this.index)
    },
    initialFadeIn() {
      if (this.isScrolledIntoView(this.$el)) this.fadedIn = true
    },
    isScrolledIntoView(el) {
      const rect = el.getBoundingClientRect()
      return rect.top <= window.innerHeight
    },
    calculateOffset(scrollTo = false) {
      if (process.server || !this.reference) return 0
      const referenceElement = this.reference[`project-${this.project.slug}`][0]
      this.offset = referenceElement?.$el.getBoundingClientRect().top + window.scrollY || 0
      if (scrollTo && typeof scrollTo !== 'object') {
        setTimeout(() => {
          window.scrollTo({
            top: this.offset,
            behavior: 'smooth',
          })
        }, 500)
      }
    },
    reduce(numerator, denominator) {
      let gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a
      }
      gcd = gcd(numerator, denominator)
      return [numerator / gcd, denominator / gcd]
    },
  },
  watch: {
    filter() {
      this.calculateOffset()
      this.initialFadeIn()
    },
    isOpen(value) {
      this.setupGallery(value)
    }
  },
}
</script>

<style lang="scss">
.project {
  position: relative;
  transition: $moderate-02 $expressive;
  transition: $slow-02 $productive;
  &.fade {
    opacity: 0;
    transform: scale(0.9);
    transition: $slow-02 $productive;
  }
  &:not(.active) {
    &:hover {
      transition: $moderate-02 $expressive;
    }
    .project-header > * {
      cursor: pointer;
      &:hover {
        img,
        iframe,
        figure {
          transition: $slow-01 $expressive;
          transform: scale(1.02) translateZ(0);
          will-change: transform;
        }
      }
    }
    .festival-container {
      opacity: 0;
      transition: $slow-01 $expressive;
      .laurel-part {
        transition: $slow-02 $expressive;
      }
      .laurel-part:first-child {
        transform: translateY(0.5em) rotate(-15deg);
        transform-origin: 50% 50%;
      }
      .laurel-part:last-child {
        transform: translateY(0.5em) rotate(15deg) scale(-1, 1) !important;
        transform-origin: 50% 50%;
      }
    }
  }
  .project-header > *:hover,
  &.active .project-header > * {
    .title-container {
      .project-title {
        opacity: 1;
        transform: translateY(-0.125em);
        transition: $moderate-02 $expressive;
        transition-property: transform opacity;
      }
      .project-category {
        opacity: 0.65;
        transform: translateY(0);
        transition: $moderate-02 $expressive;
        transition-property: transform opacity;
      }
    }
    .festival-container {
      opacity: 1;
      transform: translateY(-0.5rem);
      transition: $slow-02 $expressive $fast-02;
      .laurel-part:first-child {
        transform: translateY(0) rotate(0);
        transition: $extraslow-01 $expressive $fast-01;
      }
      .laurel-part:last-child {
        transform: translateY(0) rotate(0deg) scale(-1, 1) !important;
        transition: $extraslow-01 $expressive $fast-01;
      }
    }
  }
  &.active {
    @include dynamic-box(margin, $axis: vertical);
    will-change: margin;
    transform: translateZ(0);
    .project-header {
      @include dynamic-box(margin, true, horizontal);
      will-change: margin;
      transform: translateZ(0);
      transition: $moderate-02 $expressive;
      .content,
      .clipped::after {
        transition: $moderate-02 $expressive;
        opacity: 1;
        pointer-events: none;
      }
      &.hasControls > *:hover {
        .content,
        &.clipped::after {
          transition: $moderate-02 $expressive;
          opacity: 0;
        }
      }
    }
    &.idle {
      .element,
      .content,
      .clipped::after {
        transition: $slow-02 $expressive;
        opacity: 0;
      }
    }
  }
  .clipped {
    img,
    iframe,
    figure {
      transition: $slow-01 $expressive;
    }
  }
  .project-header {
    max-width: 100%;
    width: 100%;
    transition: $moderate-02;
    color: $white;
    z-index: 10;
    @include dynamic-box($axis: vertical);
    .clipped {
      background: $black;
      margin: 0 auto;
      &::after {
        content: '';
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.25);
        background: linear-gradient(0deg, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0) 50%);
        pointer-events: none;
      }
    }
    .content {
      @include dynamic-box();
      margin: 0;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      display: flex;
      pointer-events: none;
    }
    .title-container {
      align-self: flex-end;
      display: flex;
      flex-direction: column;
      margin: 0;
      .project-title {
        text-transform: uppercase;
        font-weight: bold;
        margin: 0;
        line-height: 1;
        font-size: 2rem;
        margin-top: 0.5em;
        opacity: 0.875;
        transform: translateY(0);
        transition: $slow-01 $expressive;
        transition-property: transform opacity;
      }
      .project-category {
        white-space: nowrap;
        opacity: 0;
        font-size: 0.875rem;
        margin: 0;
        font-weight: normal;
        letter-spacing: $letter-spacing;
        transform: translateY(1em);
        transition: $slow-01 $expressive;
        transition-property: transform opacity;
      }
      @media screen and (max-width: map-get($breakpoints, large)) {
        .project-title {
          font-size: 1.5rem;
        }
        .project-category {
          font-size: 0.75rem;
        }
      }
    }
  }
}

@media screen and (max-width: map-get($breakpoints, large)) {
  .clipped .content {
    margin: 30px;
  }
}

.project-content {
  line-height: 1.7;
  transition: $slow-01 $productive;
  margin: 0 auto;
  max-width: 640px;
  padding-bottom: 50px;
  padding-top: 0 !important;
  @include dynamic-box(padding, false, horizontal);
  & > * + * {
    margin-top: 2rem;
  }

  .expand-enter &,
  .expand-leave-to & {
    opacity: 0;
    transition-delay: 10000ms;
  }

  .project-description {
    font-family: $font-family-serif;
    font-size: 1rem;
    @media screen and (min-width: map-get($breakpoints, medium)) {
      font-size: 1.25rem;
    }
    @media screen and (min-width: map-get($breakpoints, large)) {
      font-size: 1.5rem;
    }
    .wp-block-audio {
      margin: 1em 0;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }
    & > *:first-child {
      margin-top: 0;
    }
    & > *:last-child {
      margin-bottom: 0;
    }
    a {
      color: $primary;
      &:hover {
        text-decoration: underline;
      }
    }
  }

  .alignfull,
  .alignwide {
    box-sizing: border-box;
    @include dynamic-box(margin, true, horizontal);
    img {
      height: auto;
    }
  }
  .alignfull {
    @media screen and (min-width: $wide) {
      margin: 0 calc(-#{$wide} / 2 + 50%);
      @include dynamic-box(margin, $axis: vertical);
      width: $wide;
      max-width: initial;
    }
    @media screen and (max-width: $wide - 1px) {
      margin: 0 calc(-50vw + 50%);
      @include dynamic-box(margin, $axis: vertical);
      width: $wide;
      max-width: 100vw;
    }
  }
  figure {
    margin: 0;
  }
  audio {
    width: 100%;
  }
}
.dynamic-container {
  @include dynamic-box(margin, true, horizontal);
}
</style>
<style lang="scss">
.experimental {
  .project {
    .project-header {
      & > * {
        border-radius: 10px;
      }
    }
    @media screen and (max-width: $wide) {
     &.active .project-header {
        & > * {
          border-radius: 0;
          transition-property: all;
        }
      }
    }
    .project-header:hover,
    &.active .project-header {
      .project-category {
        opacity: 1;
      }
    }
    .project-header {
      .content {
        justify-content: flex-start;
        align-items: center;
        flex-direction: column-reverse;
        .title-container {
          text-align: center;
          align-self: center;
          .project-title {
            text-transform: initial;
            opacity: 1;
          }
        }
        .festivals {
          align-items: center !important;
          flex-direction: row;
          justify-content: center !important;
          margin-bottom: 1rem;
        }
      }
    }
  }
}
</style>
