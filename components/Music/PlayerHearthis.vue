<template>
  <div class="player-container">
    <div class="backdrop clipped" :class="{ fade: !fadedIn }">
      <img :src="cover" width="100%" height="auto" />
    </div>
    <div class="cover" v-if="cookieConsent">
      <div class="cover-container" :class="{ loading: showSpinner }">
        <img :src="cover" width="500" height="500" v-if="currentTrack" />
        <transition name="fade"
          ><div class="spinner-container" v-if="showSpinner"><div class="spinner large"></div></div
        ></transition>
      </div>

      <div class="lower" v-if="currentTrack && currentTrack.user">
        <span class="artist" :title="currentTrack.user.username">{{
          currentTrack.user.username
        }}</span>
        <span class="track-title" :title="currentTrack.title">{{ currentTrack.title }}</span>
        <SocialMedia
          :links="[currentTrack.permalink_url]"
          class="player-logo"
          :size="16"
          :initialDelay="2000"
          transitionName="fade"
        />

        <span class="time">
          <span v-html="time(currentTime)" />
          <span v-html="`–${time(remainingTime)}`" />
        </span>
        <span class="progress" :style="`--width: ${progress}%`"></span>
        <div class="controls">
          <!-- <div @click="skipTrack(-1)">
            <ControlIcon name="Backward" :scale="1" />
          </div> -->
          <div @click="togglePlay(isPlaying)">
            <ControlIcon :name="isPlaying ? 'Pause' : 'Play'" :scale="1.75" />
          </div>
          <div @click="skipTrack(1)">
            <ControlIcon name="Forward" :scale="1" />
          </div>
        </div>
      </div>
    </div>
    <div v-else v-html="cookies" />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import axios from 'axios'

import variables from '@/assets/styles/_variableExport.scss'
import SocialMedia from '@/components/partials/SocialMediaLinks.vue'

import ControlIcon from '@/components/Music/ControlIcon.vue'
import CookieNotice from '@/components/partials/CookieNotice.vue'

import TransitionExpand from '@/components/partials/TransitionExpand.vue'

export default {
  name: 'Player',
  components: {
    ControlIcon,
    TransitionExpand,
    SocialMedia,
  },
  props: {
    playlistSlug: String,
  },
  data() {
    return {
      variables,
      playlist: null,
      isPlaying: false,
      audioStream: null,
      tracks: [],
      order: [],
      currentTrack: null,
      cover: '',
      currentTime: 0,
      duration: 0,
      fadedIn: false,
      isLoading: false,
      showSpinner: false,
    }
  },
  mounted() {
    this.initPlayer()
    this.$nextTick(() => (this.fadedIn = true))
  },
  destroyed() {
    this.abortStream()
  },
  computed: {
    ...mapGetters({
      cookieConsent: 'getCookieConsent',
    }),
    progress() {
      if (!this.audioStream) return 0
      return parseInt((100 / parseInt(this.audioStream.duration)) * this.currentTime)
    },
    remainingTime() {
      if (!this.duration) return 0
      if (!this.currentTime) return this.duration
      return this.duration - this.currentTime
    },
    cookies() {
      return CookieNotice.methods.blockedCookies('https://hearthis.at/' + this.playlistSlug)
    },
  },
  methods: {
    async initPlayer() {
      if (!this.cookieConsent) return
      const { data: playlist } = await axios.get('https://api-v2.hearthis.at/' + this.playlistSlug)
      this.tracks = playlist
      this.order = this.shuffle(this.tracks.map((e, i) => i))
      this.currentTrack = this.tracks[this.order[0]]
    },
    shuffle(a) {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[a[i], a[j]] = [a[j], a[i]]
      }
      return a
    },
    skipTrack(i = 1, isPlaying = !this.isPlaying) {
      if (!this.currentTrack) return
      const currentIndex = this.order.indexOf(this.tracks.indexOf(this.currentTrack))
      const next = this.order[currentIndex + i]
      const nextIndex = next !== undefined ? next : this.order[0]
      this.currentTrack = this.tracks[nextIndex]
      this.currentTime = 0
      this.abortStream()
      this.togglePlay(isPlaying, !isPlaying)
    },
    togglePlay(isPlaying = null, setup = true) {
      if (this.audioStream) return isPlaying ? this.audioStream.pause() : this.audioStream.play()
      if (setup) this.setupStream(isPlaying)
    },
    setupTrack() {
      if (!this.currentTrack) return
      this.cover = this.currentTrack.artwork_url_retina
      this.duration = this.currentTrack.duration
    },
    setupStream(pause = true) {
      if (!this.currentTrack) return
      try {
        this.audioStream = new Audio(this.currentTrack.stream_url)
      } catch (e) {
        return error.log(e)
      }
      this.audioStream.addEventListener('error', () => this.abortStream())
      this.audioStream.addEventListener('loadstart', () => {
        this.isLoading = true
        setTimeout(() => (this.showSpinner = this.isLoading), 1000)
      })
      this.audioStream.addEventListener('canplaythrough', () => (this.isLoading = false))
      this.audioStream.addEventListener('loadeddata', () => (this.isLoading = false))

      this.audioStream.addEventListener('timeupdate', () => {
        this.currentTime = this.audioStream?.currentTime
      })
      this.audioStream.addEventListener('ended', () => this.skipTrack(1, false))
      this.audioStream.addEventListener('pause', () => (this.isPlaying = false))
      this.audioStream.addEventListener('play', () => (this.isPlaying = true))

      if (!pause) this.audioStream.play()
    },
    abortStream() {
      this.audioStream?.pause()
      this.audioStream?.removeAttribute('src')
      try {
        this.audioStream?.load()
      } catch (e) {}
      this.audioStream = null
      this.isLoading = false
    },
    time(time) {
      if (isNaN(time)) return '0:00'
      const sec_num = parseInt(time, 10)
      const hours = Math.floor(sec_num / 3600)
      const minutes = Math.floor(sec_num / 60) % 60
      const seconds = sec_num % 60

      return [hours, minutes, seconds]
        .filter((v, i) => v != 0 || i > 0)
        .map((v, i) => (v < 10 && i > 0 ? '0' + v : v))
        .join(':')
    },
  },
  watch: {
    currentTrack() {
      this.setupTrack()
    },
    cookieConsent() {
      this.initPlayer()
    },
    isLoading(val) {
      if (!val) this.showSpinner = false
    },
  },
}
</script>

<style lang="scss" scoped>
.player-container {
  margin-right: auto;
  position: relative;
  margin-top: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  .cover {
    position: relative;
    display: flex;
    transition: $slow-02 $expressive;
    flex-direction: column;
    .cover-container {
      border-radius: $border-radius-large;
      position: relative;
      overflow: hidden;
      transition: $slow-01 $expressive;
      &.loading {
        transform: scale(0.95);
      }
      img {
        transition: $moderate-02 $expressive;
        display: block;
        width: 100%;
        height: auto;
        &[src=''] {
          position: relative;
          &:after {
            content: '';
            position: absolute;
            background: $light-02;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
        }
      }
    }
    .lower {
      display: flex;
      flex-direction: column;
      margin-top: map-get($padding-sizes, large);
      flex-grow: 1;
      justify-content: space-between;
      color: $white;
      .artist,
      .track-title {
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .artist,
      .time {
        font-size: 0.75rem;
      }
      .artist {
        margin-bottom: 0.25rem;
      }
      .track-title {
        font-size: 1.25rem;
        margin-bottom: 1rem;
      }
      .time {
        display: flex;
        justify-content: space-between;
      }
      .progress {
        position: relative;
        width: 100%;
        background-color: $light-02;
        height: 3px;
        margin-top: 5px;
        margin-bottom: 1rem;
        border-radius: 1em;
        &::before {
          content: '';
          height: 100%;
          background-color: $primary;
          width: var(--width);
          position: absolute;
          display: block;
          transition: $slow-01;
          border-radius: 1em 0 0 1em;
        }
      }
      
      .controls {
        display: flex;
        justify-content: center;
        margin: 1rem -0.75rem;
        & > * {
          display: flex;
          height: var(--button-size-small);
          width: var(--button-size-small);
          justify-content: center;
          align-items: center;
          transition: transform $fast-02 $expressive;
          margin: 0 0.75rem;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          &:active {
            transform: scale(0.95);
          }
          @media (hover: hover) and (pointer: fine) {
            &:hover {
              opacity: 0.5;
            }
          }
          &:first-child {
            margin-left: 0.5rem;
          }
        }
      }

      .player-logo {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        width: initial;
        color: $white;
      }
    }

    @media screen and (min-width: map-get($breakpoints, medium)) {
      width: 100%;
      flex-direction: row;
      .cover-container {
        --width: 200px;
        min-width: var(--width);
        img {
          width: var(--width);
          height: var(--width);
        }
      }
      .lower {
        justify-content: center;
        padding-right: 0;
        margin-top: 0;
        padding: map-get($padding-sizes, large) 0;
        margin-left: map-get($padding-sizes, xlarge);
        width: 0;
        .track-title,
        .progress {
          margin-bottom: auto;
        }
        .controls {
          justify-content: flex-start;
          margin: 0 -0.5rem;
        }
        .player-logo {
          right: -1rem;
        }
      }
    }
  }
}
.backdrop {
  --blur: max(6vw, 60px);
  transition: $extraslow-01 $expressive;
  transition-property: opacity;
  position: fixed;
  top: 0;
  margin: calc(var(--blur) * -2);
  width: calc(100vw + var(--blur) * 4);
  height: calc(100% + var(--blur) * 4);
  z-index: 1;
  @supports (backdrop-filter: blur(var(--blur))) {
    &::before {
      content: '';
      width: 101%;
      height: 101%;
      background: rgba($black, 0.375);
      z-index: 1;
      backdrop-filter: blur(var(--blur)) saturate(2);
    }
  }
  @supports not (backdrop-filter: blur(var(--blur))) {
    filter: blur(var(--blur)) saturate(1.5) brightness(0.8);
  }
  & ~ * {
    z-index: 2;
  }
  &.fade {
    opacity: 0;
  }
}
</style>
