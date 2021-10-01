<template>
  <div class="wrap">
    <div class="not-found-container">
      <h1 class="not-found" v-html="notFoundTransformed"></h1>
      <img :src="gifs[Math.floor(Math.random() * gifs.length)]" />
    </div>
    <h2 v-html="congratsTransformed"></h2>
    <p>This is probably not the page you're looking for.</p>
  </div>
</template>

<script>
import Player from '@/components/Music/Player.vue'

export default {
  name: 'not-found',
  components: {
    Player
  },
  data () {
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
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.notFoundFadeIn()
    })
  },
  methods: {
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
    }
  },
  watch: {
    notFound (val) {
      this.notFoundFadeIn()
    }
  }
}
</script>

<style lang="scss" scoped>

.not-found-container {
  position: relative;
  cursor: pointer;
  .not-found {
    transition: $fast-02;
  }

img {
  border-radius: $border-radius-large;
  @include dynamic-box(margin);
}
}
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    text-align: center;
  }
  h1 {
    font-size: 10rem;
    text-align: center;
    color: $primary;
    margin: 0;

  }
  h2 {
    font-size: 2rem;
    color: $light-03;
    font-family: $font-family-serif;
    font-weight: normal
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
    35%   {left: 0;opacity: 1;}
    48%  {opacity: 1;}
    49%  {left: -1ch;opacity: 0;}
    50%  {left: 1ch;opacity: 0;}
    51%  {opacity: 1;}
    65% {left: 0;opacity: 1;}
  }
</style>
