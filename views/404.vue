<template>
  <div class="wrap narrow">
    <h1 class="not-found" v-html="notFoundTransformed"></h1>
    <h2 v-html="congratsTransformed"></h2>
    <p>The page you're looking for no longer exists. It may have never existed in the first place. Look up or down to navigate, where you want to go.</p>
  </div>
</template>

<script>

export default {
  name: 'not-found',
  data () {
    return {
      notFound: '404',
      notFoundTransformed: this.notFound,
      congrats: 'Congratulations, you broke the internet.',
      congratsTransformed: this.congrats
    }
  },
  mounted () {
    this.$nextTick(function () {
      this.introductionFadeIn()
    })
  },
  methods: {
    introductionFadeIn () {
      this.notFoundTransformed = this.transformLetters(this.notFound, true)
      this.congratsTransformed = this.transformWords(this.congrats)
    },
    transformLetters (text, delay = false) {
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
    transformWords (text, delay = false) {
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
      this.introductionFadeIn()
    }
  }
}
</script>

<style lang="scss" scoped>
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
