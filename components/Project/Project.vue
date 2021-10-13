<template>
  <section
    ref="projectContainer"
    class="project"
    :class="{
      fade: !fadedIn && !isOpen,
      active: isOpen,
      idle: isAppIdle && isOpen && heroIsVideo && isPlaying,
    }"
  >
    <transition name="slide-in">
      <CloseButton class="element" v-if="isOpen" @click="close" />
    </transition>
    <transition name="slide-in">
      <ShareButton class="element" v-if="isOpen && experimental" :project="project" />
    </transition>
    <ProjectHeader :project="project" :isOpen="isOpen" :heroIsVideo="heroIsVideo" @playing="e => (isPlaying = e)" />
    <transition-expand :scrollReference="offset">
      <div v-if="isOpen" class="dynamic-container">
        <div class="project-content">
          <div v-html="description" class="project-description"></div>
          <ProjectDetails :details="project.field.details" />
          <FestivalContainer :festivals="project.field.festivals" class="alignfull dynamic-padding" />
          <div v-html="gallery" class="project-gallery"></div>
        </div>
      </div>
    </transition-expand>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import throttle from 'lodash.throttle'

import TransitionExpand from '@/components/partials/TransitionExpand.vue'
import CloseButton from '@/components/partials/CloseButton.vue'
import ShareButton from '@/components/partials/ShareButton.vue'

import ProjectHero from '@/components/Project/ProjectHero.vue'
import ProjectDetails from '@/components/Project/ProjectDetails.vue'
import FestivalContainer from '@/components/Project/FestivalContainer.vue'
import ProjectHeader from '@/components/Project/ProjectHeader.vue'

import CookieNotice from '@/components/partials/CookieNotice.vue'

export default {
  name: 'Project',
  components: {
    CloseButton,
    ShareButton,
    ProjectDetails,
    ProjectHero,
    FestivalContainer,
    TransitionExpand,
    ProjectHeader,
  },
  props: {
    project: Object,
    isOpen: Boolean,
    reference: [Object, Array],
    index: Number,
  },
  data() {
    return {
      cinemaScope: 0.4189,
      fadedIn: false,
      offset: null,
      prepareDescription: null,
      gallery: null,
      isPlaying: false
    }
  },
  computed: {
    ...mapGetters({
      filter: 'filter',
      experimental: 'getExperimental',
      cookieConsent: 'getCookieConsent',
    }),
    projectSubtitle() {
      const details = [
        this.project.field?.genre?.name,
        this.project.field?.details.length > 0
          ? this.project.field?.details.find((e) => e.label.toLowerCase().includes('year'))?.value
          : '',
      ]
      return details
        .filter((e) => e)
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
    description() {
      let description = this.prepareDescription || this.project.content.rendered
      if (this.cookieConsent) return description
      return CookieNotice.methods.blockedIframes(description)
    }
  },
  mounted() {
    this.$nextTick(function () {
      // Init
      this.calculateOffset(this.isOpen)
      this.init()
      this.setupGallery(this.isOpen)
    })

    window.addEventListener('resize', throttle(this.calculateOffset, 100))
    window.addEventListener('resize', throttle(this.initialFadeIn, 100))
    window.addEventListener('scroll', throttle(this.initialFadeIn, 30))
    window.addEventListener('touchmove', throttle(this.initialFadeIn, 30))
    window.addEventListener('afterTransition', this.initialFadeIn)
  },
  unmounted() {
    window.removeEventListener('resize', throttle(this.calculateOffset, 100))
    window.removeEventListener('resize', throttle(this.initialFadeIn, 100))
    window.removeEventListener('scroll', throttle(this.initialFadeIn, 30))
    window.removeEventListener('touchmove', throttle(this.initialFadeIn, 30))
    window.addEventListener('afterTransition', this.initialFadeIn)
  },
  methods: {
    setupGallery(open = true) {
      if (!open || (this.gallery && this.prepareDescription)) return
      const removeElements = (elms) => elms.forEach((el) => el.remove())
      const content = this.project.content.rendered
      const div = document.createElement('div')
      div.innerHTML = content
      const gallery = div.querySelectorAll('.wp-block-gallery')
      this.gallery = [...gallery][0]?.outerHTML
      removeElements(gallery)
      this.prepareDescription = div.innerHTML.replace(/<p><\/p>/gi, '').replace(/(<br>\s*)+$/,'')
    },
    close() {
      this.$store.dispatch('changeRoute', null)
      this.$emit('close')
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
      this.offset = referenceElement?.$refs.offset.getBoundingClientRect().top + window.scrollY || 0
      if (scrollTo && typeof scrollTo !== 'object') {
        setTimeout(() => {
          window.scrollTo({
            top: this.offset,
            behavior: 'smooth',
          })
        }, 500)
      }
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
  transition: $slow-02 $productive;
  .project-gallery {
    img {
      background: rgba($light-02, 0.5);
    }
  }
}

</style>
<style lang="scss" scoped>
.project {
  z-index: 10;
  &.fade {
    opacity: 0;
    transform: scale(0.9);
    transition: $slow-02 $productive;
  }
  &.active {
    @include dynamic-box(margin, $axis: vertical);
    will-change: margin;
    transform: translateZ(0);
    &.idle {
      .element,
      &::v-deep .header-copy,
      &::v-deep .clipped::after {
        transition: $slow-02 $expressive;
        opacity: 0;
      }
    }
  }


  .project-content {
    line-height: 1.7;
    transition: $slow-01 $productive;
    margin: 0 auto;
    max-width: 75ch;
    padding-bottom: 50px;
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
      &::v-deep a {
        color: $primary;
        &:hover {
          text-decoration: underline;
        }
      }
    }
    figure {
      margin: 0;
    }
    audio {
      width: 100%;
    }
  }
}

</style>
