<template>
    <div class="player-container">
      <div class="backdrop clipped" v-if="currentTrack">
        <img :src="cover" width="100%" height="auto" />
      </div>
      <div class="cover" @click="togglePlay()">
        <div class="cover-container"><div class="control" :class="isPlaying ? 'pause' : 'play'"></div>
        <img :src="cover" width="250" height="250" /></div>
        <div class="lower">
          <span class="track-title" v-if="currentTrack" :title="currentTrack.title">{{ currentTrack.title }}</span>
          <span class="time"><span>{{ time(currentTime) }}</span>
          <span>{{ time(duration) }}</span></span>
          <span class="progress" :style="`--width: ${progress}%`"></span>
        </div>
      </div>
      <span @click="next()" style="padding: 2rem; cursor: pointer;">Next</span>
      <!-- <img :src="gifs[Math.floor(Math.random() * gifs.length)]" /> -->
    </div>
    <!-- <span>
      <a v-if="currentTrack" href="javascript:void(0)" @click="togglePlay()"
        ><span v-html="isPlaying ? 'Listening' : 'Listen'"></span> to {{ currentTrack.title }}. </a
      ><a href="javascript:void(0)" @click="next()">Next.</a>
    </span> -->
  </div>
</template>

<script>
export default {
  name: 'Player',
  data() {
    return {
      cover: '',
      client_id: '853fdb79a14a9ed748ec9fe482e859dd',
      user_id: '11195685',
      isPlaying: false,
      audioStream: null,
      tracks: [],
      currentTrack: null,
      currentTime: 0,
      duration: 0,
    }
  },
  mounted() {
    this.$loadScript('https://connect.soundcloud.com/sdk.js')
      .then(() => {
        SC.initialize({ client_id: this.client_id })
        const url = `/users/${this.user_id}/tracks`
        // const url = `/playlists/1156164181/tracks`
        SC.get(url, (tracks) => {
          this.tracks = tracks
          this.currentTrack = this.randOfArray(this.tracks)
          this.setupTrack()
        })
      })
      .catch(() => {})
  },
  computed: {
    progress() {
      if (!this.audioStream) return 0
      return parseInt((100 / parseInt(this.audioStream.duration)) * this.currentTime)
    },
  },
  methods: {
    randOfArray(array) {
      return array[Math.floor(Math.random() * array.length)]
    },
    next() {
      this.audioStream.pause()
      this.isPlaying = false
      const currentIndex = this.tracks.indexOf(this.currentTrack)
      this.currentTrack =
        this.tracks[currentIndex !== this.tracks.length - 1 ? currentIndex + 1 : 0]
      this.currentTime = 0
    },
    togglePlay() {
      this.isPlaying ? this.audioStream.pause() : this.audioStream.play()
      this.isPlaying = !this.isPlaying
    },
    setupTrack() {
      if (!this.currentTrack) return
      this.cover = this.currentTrack.artwork_url.replace('-large', '-crop')
      this.audioStream = new Audio(`${this.currentTrack.uri}/stream?client_id=${this.client_id}`)
      this.audioStream.addEventListener(
        'timeupdate',
        () => (this.currentTime = this.audioStream.currentTime)
      )
      this.audioStream.addEventListener(
        'loadeddata',
        () => (this.duration = this.audioStream.duration)
      )
    },
    time(time) {
      const sec_num = parseInt(time, 10)
      const hours = Math.floor(sec_num / 3600)
      const minutes = Math.floor(sec_num / 60) % 60
      const seconds = sec_num % 60

      return [hours, minutes, seconds]
        .map((v) => (v < 10 ? '0' + v : v))
        .filter((v, i) => v !== '00' || i > 0)
        .join(':')
    },
  },
  watch: {
    currentTrack() {
      this.setupTrack()
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

  .cover {
    cursor: pointer;
    border-radius: $border-radius-large;
    position: relative;
    display: flex;
    flex-direction: column;
    color: $black;
    overflow: hidden;
    transition: $moderate-02 $expressive;
    width: 250px;
    .cover-container {
      position: relative;
      overflow: hidden;
      img {
        transition: $moderate-02 $expressive;
        display: block;
      }
    }
    &:hover {
      .cover-container {
        img {
          transform: scale(1.02);
        }
      }
    }
    &:active {
      transform: scale(0.95);
    }
    .lower {
      background: white;
      display: flex;
      flex-direction: column;
      padding: map-get($padding-sizes, xlarge);
      .track-title {
        font-size: 1rem;
        margin-bottom: 1rem;
        max-width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .time {
        font-size: 0.75rem;
        display: flex;
        color: $dark-01;
        justify-content: space-between;
      }
    }
  }
  .control {
    --rotate: 180deg;
    --height: 30px;
    --width: calc(var(--height) / 5 * 6);
    --border-left: calc(var(--height) / 5);
    position: absolute;
    width: var(--width);
    height: var(--width);
    transition: $slow-01;
    left: 50%;
    top: 50%;
    transform: rotate(var(--rotate)) translate(-50%, -50%);
    transform-origin: 0 0;
    z-index: 100;
    &::before,
    &::after {
      --left: 0;
      --right: 0;
      --border-top: 0;
      content: '';
      width: 0;
      height: var(--height);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: var(--left);
      transition: $moderate-02;
      border-top: var(--border-top) solid transparent;
      border-bottom: var(--border-top) solid transparent;
      border-left: var(--border-left) solid white;
      will-change: left, transform, border;
      backface-visibility: visible;
    }
    &::after {
      box-sizing: border-box;
    }
    &.pause {
      &::before {
        --left: var(--border-left);
      }
      &::after {
        --left: calc(var(--width) - var(--border-left) * 2);
      }
    }
    &.play {
      --rotate: 0deg;
      &::before,
      &::after {
        --height: calc(var(--width) / 2);
        --border-top: calc(var(--width) / 4);
        --border-left: calc(var(--width) / 2);
      }
      &::before {
        --left: calc(var(--width) * 0.1);
      }
      &::after {
        --left: calc(var(--width) * 0.6);
      }
    }
  }
  .progress {
    position: relative;
    width: 100%;
    background-color: $light-02;
    height: 3px;
    margin-top: 5px;
    &::before {
      content: '';
      height: 100%;
      background-color: $primary;
      width: var(--width);
      position: absolute;
      display: block;
      transition: $slow-01;
    }
  }
}
.backdrop {
  --blur: 50px;
  position: fixed;
  left: calc(var(--blur) * -2);
  top: calc(var(--blur) * -2);
  width: calc(100vw + var(--blur) * 4);
  height: calc(100vh + var(--blur) * 4);
  z-index: 1;
  &::before {
    content: '';
    width: 100%;
    height: 100%;
    background: #33333360;
    z-index: 1;
  }
  img {
    filter: blur(var(--blur)) saturate(2);
  }
  & ~ * {
    z-index: 2;
  }
}
</style>
<style lang="scss">
.musica {
  color: white !important;
  .wrap.page {
    padding: 0 !important;
  }
  p,
  h2 {
    color: white !important;
  }
  .title-container .string {
    .logo,
    .description {
      color: white !important;
    }
  }
}
#app:not(.musica) {
  .backdrop {
    display: none;
  }
}
footer {
  z-index: 3;
}
</style>
