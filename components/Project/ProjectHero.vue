<template>
  <div>
    <LazyImage
      v-if="project.thumbnail && project.thumbnail['cinema-small']"
      :class="hero.type"
      :lazySrc="project.thumbnail['cinema-small'][0]"
      :lazySrcset="srcSet"
      :alt="project.title.rendered"
      @loaded="heroLoaded"
    />
    <transition name="slide-in" mode="out-in">
      <div ref="hero-container" v-if="open && hero.type" class="hero-container">
        <client-only v-if="hero.type === 'vimeo' && cookieConsent">
          <vimeo
            :class="hero.type"
            :video-id="hero.data"
            ref="video"
            @playing="playing"
            @pause="paused"
          ></vimeo>
        </client-only>
        <youtube
          v-if="hero.type === 'youtube' && cookieConsent"
          host="https://www.youtube-nocookie.com"
          :class="hero.type"
          :video-id="hero.data"
          :player-vars="{rel: 0}"
          ref="video"
          :nocookie="true"
          @playing="playing"
          @paused="paused"
        ></youtube>
        <figure v-else-if="hero.type === 'video_local'" ref="video">
          <video
            @playing="updatePlaying"
            controls
            controlsList="nodownload"
            :class="hero.type"
            :src="hero.data"
            :alt="project.title.rendered"
          ></video>
        </figure>
        <figure v-else-if="hero.type === 'image_link'">
          <img :class="hero.type" :src="hero.data" :alt="project.title.rendered" />
        </figure>
				<div v-else-if="isExternalVideo && !cookieConsent" class="cookie-consent" v-html="cookieMessage"></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Youtube } from 'vue-youtube'
import { vueVimeoPlayer } from 'vue-vimeo-player'
import { mapGetters } from 'vuex'

import LazyImage from '@/components/partials/LazyImage.vue'
import CookieNotice from '@/components/partials/CookieNotice.vue'


export default {
  name: 'Hero',
  props: {
    open: Boolean,
    project: Object
  },
  components: {
    LazyImage,
    youtube: Youtube,
    vimeo: vueVimeoPlayer
  },
  data() {
    return {
      srcSet: '',
      sizes: '',
      hero: {
        type: '',
        data: '',
      },
      player: null,
    }
  },
  computed: {
    ...mapGetters({
      cookieConsent: 'getCookieConsent',
    }),
    imageSizes() {
      return this.generateSrcSet()
    },
    isExternalVideo() {
      return ['vimeo', 'youtube'].includes(this.hero.type)
    },
    cookieMessage() {
      let url
      switch (this.hero.type) {
        case 'youtube':
          url = `https://www.youtube.com/watch?v=${this.hero.data}`
          break
        case 'vimeo':
          url = `https://vimeo.com/${this.hero.data}`
          break
        default:
          url = this.hero.data
      }
      return CookieNotice.methods.blockedCookies(url)
    }
  },
  mounted() {
    this.$nextTick(function () {
      this.heroType()
      this.heroLoaded()
    })
  },
  methods: {
    heroLoaded(value) {
      const val = this.project.thumbnail ? value : true
      this.$emit('loaded', val)
    },
    generateSrcSet() {
      const sizes = ['thumbnail', 'cinema-small', 'cinema-medium', 'cinema-large', 'cinema-xlarge']
      const srcSetTmp = []
      const sizesTmp = []
      const sortableThumbnails = []
      if (this.project.thumbnail) {
        for (const size in this.project.thumbnail) {
          if (sizes.includes(size)) {
            sortableThumbnails.push([
              this.project.thumbnail[size][0],
              this.project.thumbnail[size][1],
            ])
          }
        }
        sortableThumbnails.sort(function (a, b) {
          return a[1] - b[1]
        })
        sortableThumbnails.forEach(function (thumbnail, i, array) {
          srcSetTmp.push(thumbnail[0] + ' ' + thumbnail[1] + 'w')
          if (i === array.length - 1) {
            sizesTmp.push(thumbnail[1] + 'px')
          } else {
            const k = i + 1
            // sizesTmp.push('(max-width: ' + thumbnail[1] + 'px) ' + thumbnail[1] + 'px');
          }
        })
        this.srcSet = srcSetTmp.join(', ')
        this.sizes = '100vw'
      }
    },
    heroType() {
      if (this.project.field?.hero?.type) {
        const type = this.project.field.hero.type
        if (this.project.field.hero[type]) {
          this.hero.type = type
          this.hero.data = this.project.field.hero[type]
        }
      }
    },

    // music
    playing() {
      this.$emit('playing', true)
    },
    paused() {
      this.$emit('playing', false)
    },
    updatePlaying(value) {
      if (value === 1) {
        this.playing()
      } else {
        this.paused()
      }
    }
  },
  watch: {
    imageSizes(val) {
      this.generateSrcSet()
    },
  },
}
</script>

<style lang="scss" scoped>
figure {
  margin: 0;
}
.hero-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
</style>
