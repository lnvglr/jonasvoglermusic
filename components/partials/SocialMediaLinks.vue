<template>
  <div class="icon-wrap" :class="transitionName" :style="`--size: ${size}px`">
    <div v-for="icon in this.iconMarkup" :class="icon.classes" :style="icon.variables" :key="icon.name">
      <a :href="icon.link" target="_blank" :title="icon.name" v-html="icon.markup" />
    </div>
  </div>
</template>

<script>
import icons from "@/assets/socialMediaIcons.json"
export default {
  name: 'SocialMediaLinks',
  props: {
    links: {
      type: Array,
      required: true
    },
    size: {
      type: Number,
      default: 32
    },
    initialDelay: {
      type: Number,
      default: 0
    },
    transitionName: {
      type: String,
      default: 'slide'
    }
  },
  data() {
    return {
      icons,
      iconMarkup: [],
    }
  },
  created() {
    Object.keys(this.icons).forEach(
      (icon) => (this.icons[icon].slug = this.icons[icon].slug ? this.icons[icon].slug : icon)
    )
  },
  mounted() {
    this.$nextTick(function () {
      this.generateIcon()
      this.init()
    })
  },
  methods: {
    init() {
      setTimeout(() => this.$el.classList.remove(this.transitionName), this.initialDelay)
    },
    generateIcon() {
      if (this.links.filter(e => e).length > 0) this.iconMarkup = this.links.map((link, key) => this.iconHTML(link, this.matchIcon(this.domainFromUrl(link)), key))
    },
    domainFromUrl(url) {
      if (url === undefined) return
      const expression =
        /((http|ftp|https):\/\/)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/gi
      if (url.match(expression)) {
        const s = new URL(url)
        return s.hostname
      }
    },
    matchIcon(domain) {
      if (!domain) return
      let iconArr = []
      const temp = []
      Object.keys(this.icons).forEach((icon) =>
        domain.includes(this.icons[icon].slug)
          ? temp.push([this.icons[icon].slug, this.icons[icon]])
          : false
      )
      if (Array.isArray(temp) && temp.length) {
        iconArr = temp[0]
      } else {
        iconArr = [
          domain,
          {
            color: false,
            name: domain,
            svg: false,
            initial: domain.charAt(0).toUpperCase(),
          },
        ]
      }
      return iconArr
    },
    iconHTML(link, icon, index) {
      if (!icon) return
      const area = Math.pow(this.size, 2)
      const name = icon[1]?.name
      const color = icon[1]?.color
      const classes = [icon[0], 'social-media-icon'].join(' ')

      let variables = ''
      let markup = ''
      if (icon[1].svg) {
        let temp = document.createElement('div')
        temp.innerHTML = icon[1].svg
        temp = temp.firstElementChild.attributes
        const list = Object.keys(temp).map((index) => temp[index])
        const viewBox = list
          .find((node) => node.name === 'viewBox')
          .value.split(' ')
          .slice(2, 4)
        const divider = (viewBox[0] * viewBox[1]) / area
        const newWidth = (viewBox[0] / Math.sqrt(divider)).toFixed(2)
        const width = newWidth + 'px'
        const delay = index * 100
        const div = document.createElement('div');
        div.innerHTML = icon[1].svg;
        div.querySelectorAll("svg")[0].style.width = width
        markup = div.innerHTML
        variables += `--delay: ${delay}ms; --color: ${color};`
      } else if (icon[1].initial) {
        markup = `<span>${icon[1].initial}</span>`
      }

      return {
        classes,
        variables,
        link,
        name,
        markup
      }
    },
  },
  watch: {
    links() {
      this.generateIcon()
    }
  }
}
</script>

<style lang="scss">
.icon-wrap {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  margin: 0 auto;
  box-sizing: border-box;
  --delay: 0ms;
  --color: $secondary;
  --size: 32px;

  &.fade .social-media-icon {
    opacity: 0;
    transform: scale(0.9);
  }
  &.slide .social-media-icon {
    opacity: 0;
    transform: translateX(50%);
  }
  .social-media-icon {
    transition: $slow-02 $expressive;
    transition-property: opacity, transform;
    transition-delay: var(--delay);
    a {
      display: flex;
    }
    svg,
    span {
      font-size: calc(var(--size) * 1.125);
      font-weight: bold;
      text-align: center;
      line-height: 1;
      height: var(--size);
      width: var(--size);
      padding: 0.75rem 1rem;
      fill: currentColor;
      box-sizing: content-box;
      &:hover {
        color: var(--color);
      }
    }
  }

  @media screen and (min-width: map-get($breakpoints, large)) {
    & {
      justify-content: center;
    }
  }
}
</style>
