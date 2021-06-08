<template>
  <section
    ref="projectContainer"
    class="project"
    :class="{
      fade: !fadedIn,
      active: isOpen,
      idle: idle && isOpen && heroIsVideo,
    }"
  >
    <transition name="fade">
      <CloseButton class="element" v-if="isOpen" @click="close" />
    </transition>
    <div
      class="project-header"
      ref="projectHeader"
      :class="{ hasControls: heroIsVideo }"
      @click="open(project.slug)"
    >
      <!-- :style="`--aspect-ratio: ${aspectRatio}%;`" -->
      <div
        class="clipped cinema"
        :style="`padding-bottom: ${aspectRatio}%;`"
        ref="projectThumbnail"
      >
        <div class="content">
          <component :is="isOpen ? 'h2' : 'span'" class="title-container">
            <span v-if="projectSubtitle" class="project-category" v-html="projectSubtitle"></span>
            <span class="project-title">{{ project.title.rendered }}</span>
          </component>
          <div v-if="headerFestivals" class="festivals">
            <Festival
              v-for="(festival, i) in headerFestivals"
              :key="i"
              :festival="festival"
              :class="{ 'hide-medium-down': festival.show_in_header }"
            />
          </div>
        </div>
        <ProjectHero class="hero" :open="isOpen" :project="project" />
      </div>
    </div>
    <transition-expand :scrollReference="offset">
      <div v-if="isOpen">
        <div
          v-if="project.content.rendered || project.field.details || project.field.festivals"
          class="project-content"
        >
          <div v-html="project.content.rendered" class="project-description"></div>
          <ProjectDetails v-if="project.field.details" :details="project.field.details" />
          <div v-if="project.field.festivals" class="festivals">
            <Festival
              v-for="(festival, i) in project.field.festivals"
              :key="i"
              :festival="festival"
            />
            <!-- :class="{ 'hide-large': festival.show_in_header }" -->
          </div>
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

import ProjectHero from '@/components/Project/ProjectHero.vue'
import ProjectDetails from '@/components/Project/ProjectDetails.vue'
import Festival from '@/components/Project/Festival.vue'

export default {
  name: 'Project',
  components: {
    CloseButton,
    ProjectDetails,
    ProjectHero,
    Festival,
    TransitionExpand,
  },
  props: {
    project: {
      type: Object,
    },
    isOpen: {
      type: Boolean,
    },
    index: {
      type: Number,
    },
  },
  data() {
    return {
      cinemaScope: 0.4189,
      scale: 1 / 0.95,
      isLoaded: false,
      fadedIn: false,
      offset: null,
      vOffset: 'nothing',
    }
  },
  computed: {
    ...mapGetters({
      filter: 'filter',
    }),
    projectSubtitle() {
      const details = [
        this.project.field?.genre.name,
        this.project.field?.details.find((e) => e.label.toLowerCase().includes('year'))?.value,
        // this.project.field?.details.find(e => e.label.toLowerCase().includes('duration'))?.value
      ]
      return details
        .filter((e) => e !== null)
        .map((e) => `<span>${e}</span>`)
        .join('<span class="sr-only">,</span><span class="em-space"> </span>')
        .concat('<span class="sr-only">:</span>')
    },
    idle() {
      return this.isAppIdle
    },
    heroIsVideo() {
      return ['vimeo', 'youtube', 'video_local'].includes(this.project.field?.hero?.type)
    },
    headerFestivals() {
      if (!this.project.field?.festivals) return
      return this.project.field?.festivals.filter((e) => e.show_in_header)
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
            !this.project.field?.hero?.custom_ratio.num &&
            !this.project.field?.hero?.custom_ratio.num
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
    })

    window.addEventListener('resize', _.throttle(this.calculateOffset, 100))
    window.addEventListener('resize', _.throttle(this.initialFadeIn, 100))
    window.addEventListener('scroll', _.throttle(this.initialFadeIn, 30))
  },
  unmounted() {
    window.removeEventListener('resize', _.throttle(this.calculateOffset, 100))
    window.removeEventListener('resize', _.throttle(this.initialFadeIn, 100))
    window.removeEventListener('scroll', _.throttle(this.initialFadeIn, 30))
  },
  watch: {
    filter() {
      this.calculateOffset()
      this.initialFadeIn()
    },
  },
  methods: {
    close() {
      console.log('s')
      this.$store.commit('changeRoute', '')
      this.$emit('close')
      window.scrollBy({
        top: -50,
        behavior: 'smooth',
      })
    },
    open(slug) {
      this.$store.commit('changeRoute', slug)
      this.$emit('open', slug)
    },
    init() {
      const self = this
      const initialDelay = 100
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
      if (this.$refs.projectHeader && this.$refs.projectThumbnail && this.$refs.projectContainer) {
        const projectHeader = this.$refs.projectHeader.getBoundingClientRect().height
        const thumbnailHeight = this.$refs.projectThumbnail.getBoundingClientRect().height
        const projectPadding = projectHeader - thumbnailHeight
        const projectContainerHeight =
          this.$refs.projectContainer.getBoundingClientRect().width * this.cinemaScope

        this.offset = (projectContainerHeight + projectPadding) * this.scale * this.index + 200
        this.vOffset = this.$refs.projectContainer.getBoundingClientRect().top

        if (scrollTo && typeof scrollTo !== 'object') {
          setTimeout(() => {
            window.scrollTo({
              top: this.offset,
              behavior: 'smooth',
            })
          }, 500)
        }
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
}
</script>

<style lang="scss">
.project {
  position: relative;
  transition: $moderate-02 $expressive;
  transition: $slow-02 $productive;
  &.fade {
    opacity: 0;
    transform: scale(0.95);
    transition: $slow-02 $productive;
    .clipped {
      // padding-bottom: 33%;
    }
  }
  &:not(.active) {
    &:hover {
      // transform: scale(1.01);
      transition: $moderate-02 $expressive;
      img,
      iframe,
      figure {
        transition: $moderate-02 $expressive;
        transform: scale(1.02) translateZ(0);
        will-change: transform;
      }
    }
    .project-header > * {
      cursor: pointer;
    }
  }
  &:hover,
  &.active {
    .project-header {
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
    }
  }
  &.active {
    @include dynamic-box(margin, $axis: vertical);
    .project-header {
      @include dynamic-box(margin, true, horizontal);
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
      transition: $moderate-02 $expressive;
    }
  }
  .project-header {
    max-width: 100%;
    width: 100%;
    transition: $moderate-02;
    color: $white;
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
        background: transparent;
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
  transition-delay: $slow-01;
  transform: scale(1);
  margin: 0 auto;
  max-width: 640px;
  padding-bottom: 50px;
  padding-top: 0 !important;

  .expand-enter &,
  .expand-leave-to & {
    transform: scale(0.9);
    transition: $slow-01 $productive;
  }
  .project-description {
    font-family: $font-family-serif;
    font-size: 1rem;
    opacity: 1;
    box-sizing: content-box;
    transition: $slow-01 $productive;
    @media screen and (min-width: map-get($breakpoints, medium)) {
      font-size: 1.25rem;
    }
    @media screen and (min-width: map-get($breakpoints, large)) {
      font-size: 1.5rem;
    }
    .expand-enter-active &,
    .expand-leave-to & {
      opacity: 0;
      transition: $slow-01 $productive;
    }
    .wp-block-audio {
      margin: 1em 0;
      margin-inline-start: 0;
      margin-inline-end: 0;
    }
    .alignfull,
    .alignwide {
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
    p {
      &:first-child {
        margin-top: 0;
      }
    }
    a {
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
.festivals {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
.project-content {
  .festivals {
    margin-top: 2rem;
    padding: 20px;
  }
}
</style>
