<template>
  <div class="project-header" :class="{ hasControls: heroIsVideo, active: isOpen }">
    <div
      class="clipped cinema"
      :style="`padding-bottom: ${aspectRatio}%;`"
      @click="open(project.slug)"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <div class="header-copy">
        <component :is="isOpen ? 'h2' : 'span'" class="title-container">
          <span v-if="projectSubtitle" class="project-category" v-html="projectSubtitle"></span>
          <span class="project-title" v-html="projectTitle"></span>
        </component>
          <!-- :festivals="project.field.festivals" -->
        <FestivalContainer
          :festivals="headerFestivals"
          class="hide-medium-down"
          :small="true"
          :active="hover || isOpen"
        />
      </div>
      <ProjectHero
        class="hero"
        :open="isOpen"
        :project="project"
        @playing="e => $emit('playing', e)"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import ProjectHero from '@/components/Project/ProjectHero.vue'
import FestivalContainer from '@/components/Project/FestivalContainer.vue'

export default {
  name: 'ProjectHeader',
  components: {
    ProjectHero,
    FestivalContainer,
  },
  props: {
    project: Object,
    isOpen: Boolean,
    heroIsVideo: Boolean,
  },
  data() {
    return {
      cinemaScope: 0.4189,
      description: null,
      hover: null,
    }
  },
  computed: {
    ...mapGetters({
      experimental: 'getExperimental',
    }),
    projectTitle() {
      const title = this.project.title.rendered
      return title.length > 30 ? title.replace(/([.,!;:–])/g, '$1<br>') : title
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
  methods: {
    open(slug) {
      this.$store.dispatch('changeRoute', slug)
      this.$emit('open', slug)
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

<style lang="scss" scoped>

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
      background: linear-gradient(0deg, rgba(0, 0, 0, 0.625) 0%, rgba(0, 0, 0, 0) 50%);
      pointer-events: none;
      opacity: 0.75;
      transform: scale(1) translateY(0%);
      transition: all $extraslow-01 $expressive;
    }

    .header-copy {
      position: absolute;
      z-index: 10;
      bottom: 0;
    }

    &::v-deep {
      img,
      iframe,
      figure {
        transition: $slow-02 $expressive;
      }
    }
  }
  .header-copy {
    @include dynamic-box();
    margin: 0;
    width: 100%;
    height: 100%;
    display: flex;
    pointer-events: none;
    text-shadow: var(--shadow);
    .title-container {
      align-self: flex-end;
      display: flex;
      flex-direction: column;
      margin: 0;
      pointer-events: all;
      .project-title {
        text-transform: uppercase;
        font-weight: bold;
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
  &:not(.active) > * {
    cursor: pointer;
    &:hover::v-deep  {
      img,
      iframe,
      figure {
        transition: $slow-01 $expressive;
        transform: scale(1.02) translateZ(0);
        will-change: transform;
      }
    }
  }
  & > *:hover,
  &.active > * {
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
    &.clipped {
      &::after {
        opacity: 1;
        transform: scale(1.75) translateY(-20%);
        transition: all $slow-02 $expressive;
      }
    }
  }
  &.active {
    @include dynamic-box(margin, true, horizontal);
    will-change: margin;
    transform: translateZ(0);
    transition: $moderate-02 $expressive;
    .header-copy,
    .clipped::after {
      transition: $moderate-02 $expressive;
      opacity: 1;
      pointer-events: none;
    }
    &.hasControls > *:hover {
      .header-copy,
      &.clipped::after {
        transition: $moderate-02 $expressive;
        opacity: 0;
      }
      .header-copy .title-container {
        pointer-events: none;
      }
    }
  }
  &.idle {
    .element,
    .header-copy,
    .clipped::after {
      transition: $slow-02 $expressive;
      opacity: 0;
    }
  }
}
</style>
<style lang="scss">
.experimental {
  .project {
    .project-header {

      .header-copy {
        justify-content: flex-start;
        align-items: center;
        flex-direction: column-reverse;
        .title-container {
          text-align: center;
          align-self: center;
          .project-title {
            text-transform: initial;
            opacity: 1;
						font-weight: normal;
          }
        }
      }
      & > * {
        border-radius: 10px;
        -webkit-backface-visibility: hidden;
        -moz-backface-visibility: hidden;
        backface-visibility: hidden;
        -webkit-transform: translate3d(0, 0, 0);
        -moz-transform: translate3d(0, 0, 0);
        transform: translate3d(0, 0, 0);
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
    .project-header > *:hover,
    &.active .project-header {
      .project-category {
        opacity: 1;
      }
    }
  }
}
</style>
