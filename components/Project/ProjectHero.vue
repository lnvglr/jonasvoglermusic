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
    <transition name="fade" mode="out-in">
      <div ref="hero-container" v-if="open && hero.type" @click="updatePaused">
        <iframe
          v-if="hero.type === 'vimeo'"
          ref="video"
          :class="hero.type"
          :src="'https://player.vimeo.com/video/' + hero.data"
          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
          frameborder="0"
          allow="autoplay; fullscreen"
          allowfullscreen
        ></iframe>
        <iframe
          v-else-if="hero.type === 'youtube'"
          ref="video"
          :class="hero.type"
          :src="'https://www.youtube.com/embed/' + hero.data + '?enablejsapi=1'"
          frameborder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></iframe>
        <figure v-else-if="hero.type === 'video_local'" ref="video">
          <video
            @playing="updatePaused"
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
      </div>
    </transition>
  </div>
</template>

<script>
import LazyImage from '@/components/partials/LazyImage.vue'

export default {
  name: 'Hero',
  props: {
    open: Boolean,
    project: Object,
  },
  components: {
    LazyImage,
  },
  data() {
    return {
      srcSet: '',
      sizes: '',
      hero: {
        type: '',
        data: '',
      },
      videoElement: null,
      paused: null,
      player: null,
    }
  },
  computed: {
    imageSizes() {
      return this.generateSrcSet()
    },
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
    interrupt() {
      if (this.$refs.video) {
        if (this.$refs.video.contentWindow) {
          this.$refs.video.contentWindow.postMessage(
            this.messageFn('pause', this.$refs.video.src),
            '*'
          )
        } else if (!this.$refs.video.children) {
          if (!this.$refs.video.children[0].paused) {
            this.$refs.video.children[0].pause()
          }
        }
      }
    },
    messageFn(action, src) {
      if (src.search('vimeo') > 0) {
        // case for Vimeo
        return JSON.stringify({
          method: action,
        })
      } else if (src.search('youtube') > 0) {
        // case for youTube
        return JSON.stringify({
          event: 'command',
          func: action + 'Video',
        })
      } else {
        // case for other video services (e.g. facebook..)
        return action
      }
    },
    updatePaused(event) {
      if (this.$refs.video) {
        if (this.$refs.video.contentWindow) {
          // console.log(this.$refs.video.contentWindow);
        }
      }
      this.videoElement = event.target
      this.paused = event.target.paused
      // this.$store.dispatch('setCurrentlyPlaying', { track: 'project' })
    },
    play() {
      this.videoElement.play()
    },
    pause() {
      this.videoElement.pause()
    },
  },
  watch: {
    imageSizes(val) {
      this.generateSrcSet()
    },

    // currentlyPlaying (track) {
    //   if (track && track !== 'project') {
    //     this.interrupt()
    //   }
    // }
  },
}
</script>

<style lang="scss" scoped>
figure {
  margin: 0;
}
</style>
