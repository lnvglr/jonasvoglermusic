<template>
  <div class="wrap">
    <div class="not-found-container" @click="togglePlay()">
      <h1 class="not-found" v-html="notFoundTransformed" v-if="!isPlaying"></h1>
      <div class="control" :class="isPlaying ? 'play' : 'pause'"></div>
      <!-- <img :src="gifs[Math.floor(Math.random() * gifs.length)]" /> -->
      <img id="artwork" :src="cover" width="250" height="250" />
    </div>
    <span>
      <a v-if="currentTrack" href="javascript:void(0)" @click="togglePlay()"
        ><span v-html="isPlaying ? 'Listening' : 'Listen'"></span> to {{ currentTrack.title }}. </a
      ><a href="javascript:void(0)" @click="next()">Next.</a>
    </span>
    <h2 v-html="congratsTransformed"></h2>
    <p>This is probably not the page you're looking for.</p>
  </div>
</template>

<script>
export default {
  name: 'not-found',
  data() {
    return {
      notFound: '404',
      notFoundTransformed: this.notFound,
      congrats: 'Congratulations, you broke the internet.',
      congratsTransformed: this.congrats,
      gifs: [
        'https://media.giphy.com/media/1zjNTEctIuXcJ9ZTEP/giphy.gif',
        'https://media.giphy.com/media/6uGhT1O4sxpi8/giphy.gif',
        'https://media.giphy.com/media/xULW8vi25RrpxQrmrm/giphy.gif',
        'https://media.giphy.com/media/xT0xewLy70uaFY3Vte/giphy.gif',
        'https://media.giphy.com/media/32aTqconrLrYKFqdAw/giphy.gif',
      ],

      cover: '',
      client_id: '853fdb79a14a9ed748ec9fe482e859dd',
      user_id: '11195685',
      isPlaying: false,
      audioStream: null,
      tracks: [],
      currentTrack: null,
    }
  },
  mounted() {
    this.$loadScript('https://connect.soundcloud.com/sdk.js')
      .then(() => {
        SC.initialize({ client_id: this.client_id })
        SC.get(`/users/${this.user_id}/tracks`, (tracks) => {
          this.tracks = tracks
          this.currentTrack = this.randOfArray(this.tracks)
        })
      })
      .catch(() => {
        // Failed to fetch script
      })
    this.$nextTick(function () {
      this.notFoundFadeIn()
    })
  },
  methods: {
    randOfArray(array) {
      return array[Math.floor(Math.random() * array.length)]
    },
    next() {
      this.audioStream.pause()
      this.isPlaying = false
      this.currentTrack = this.randOfArray(this.tracks)
    },
    togglePlay() {
      this.isPlaying ? this.audioStream.pause() : this.audioStream.play()
      this.isPlaying = !this.isPlaying
    },
    notFoundFadeIn() {
      this.notFoundTransformed = this.transformLetters(this.notFound, true)
      this.congratsTransformed = this.transformWords(this.congrats)
    },
    transformLetters(text, delay = false) {
      const scopeId = this.$options._scopeId
      const duration = 300
      const words = text.split(' ')
      let char = 0
      let transformedText = ''
      words.forEach(function (word) {
        const letters = word.split('')
        transformedText += `<span ${scopeId} class="word">`
        letters.forEach(function (letter) {
          const style = delay ? `style="animation-delay: ${(duration / text.length) * char}ms"` : ''
          transformedText += `<span ${scopeId} class="letter-container"><span ${scopeId} class="letter" ${style}>${letter}</span></span>`
          char++
        })
        transformedText += '</span> '
      })
      return transformedText
    },
    transformWords(text, delay = false) {
      const scopeId = this.$options._scopeId
      const words = text.split(' ')
      let transformedText = ''
      words.forEach(function (word) {
        transformedText += `<span
          ${scopeId}
          class="word"
          >${word}</span> `
      })
      return transformedText
    },
    setupTrack() {
      if (!this.currentTrack) return
      this.cover = this.currentTrack.artwork_url.replace('-large', '-crop')
      this.audioStream = new Audio(`${this.currentTrack.uri}/stream?client_id=${this.client_id}`)
    },
  },
  watch: {
    notFound(val) {
      this.notFoundFadeIn()
    },
    currentTrack() {
      this.setupTrack()
    },
  },
}
</script>

<style lang="scss" scoped>
.not-found-container {
  position: relative;
  cursor: pointer;
  .control {
    position: absolute;
    transition: $slow-01;
    --rotate: 180deg;
    transform: rotate(var(--rotate));
    &::before,
    &::after {
      --left: 0;
      --right: 0;
      --border-left: 10px;
      --height: 50px;
      --width: 60px;
      --border-top: 0;
      content: '';
      width: 0;
      height: var(--height);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: var(--left);
      transition: $fast-02;
      border-top: var(--border-top) solid transparent;
      border-bottom: var(--border-top) solid transparent;
      border-left: var(--border-left) solid white;
    }
    &::after {
      box-sizing: border-box;
    }
    &.play {
      &::before {
        --left: calc(var(--border-left) / -1 - var(--width) / 10);
      }
      &::after {
        --left: calc(var(--width) / 10);
      }
    }
    &.pause {
      opacity: 0;
      --rotate: 0deg;
      &::before,
      &::after {
        --height: 30px;
        --width: 50px;
        --border-top: calc(var(--height) / 2);
        --border-left: calc(var(--width) / 2);
      }
      &::before {
        --left: calc(var(--width) / -2);
      }
      &::after {
        --left: 0;
      }
    }
  }
  .not-found {
    transition: $fast-02;
  }
  &:hover {
    .not-found {
      opacity: 0;
    }
    .control {
      opacity: 1;
    }
  }
}
div {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
}
h2 {
  font-size: 2rem;
  color: $light-03;
  font-family: $font-family-serif;
  font-weight: normal;
}
p {
  color: $dark-01;
}
.not-found {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 5rem;
  text-align: center;
  color: white;
  // color: $primary;
  pointer-events: none;
  margin: 0;
  .word {
    display: inline-block;
    white-space: nowrap;
  }
  .letter-container {
    display: inline-block;
    overflow: hidden;
    .letter {
      position: relative;
      transition: $slow-02 $expressive;
      animation-name: slide-auto;
      animation-duration: 3s;
      animation-iteration-count: infinite;
    }
  }
}
@keyframes slide-auto {
  35% {
    left: 0;
    opacity: 1;
  }
  48% {
    opacity: 1;
  }
  49% {
    left: -1ch;
    opacity: 0;
  }
  50% {
    left: 1ch;
    opacity: 0;
  }
  51% {
    opacity: 1;
  }
  65% {
    left: 0;
    opacity: 1;
  }
}
img {
  border-radius: $border-radius-large;
  @include dynamic-box(margin);
}
</style>
