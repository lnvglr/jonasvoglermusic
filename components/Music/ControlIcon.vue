<template>
  <button :style="`--size: ${String(size)}px; --scale: ${String(scale)}`" :class="{ circle, pulse, [name]: name, static: !animate }" >
    <svg v-if="animate" :viewBox="`0 0 ${viewBox} ${viewBox}`">
      <path
        :d="iconPath(active)"
        :transform="mirror ? `rotate(180, ${viewBox / 2}, ${viewBox / 2})` : ''"
      >
        <animate
          ref="animate"
          attributeType="XML"
          attributeName="d"
          :from="iconPath(!active)"
          :to="iconPath(active)"
          :dur="`${variables['fast-02']}ms`"
          begin="indefinite"
          fill="freeze"
        />
      </path>
    </svg>
    <component v-else :is="name" />
  </button>
</template>

<script>
import variables from '@/assets/styles/_variableExport.scss'

import Play from '@/components/Music/icons/play.fill.svg'
import PlayCircle from '@/components/Music/icons/play.circle.svg'
import Pause from '@/components/Music/icons/pause.fill.svg'
import Forward from '@/components/Music/icons/forward.fill.svg'
import Backward from '@/components/Music/icons/backward.fill.svg'
import ForwardEnd from '@/components/Music/icons/forward.end.fill.svg'
import BackwardEnd from '@/components/Music/icons/backward.end.fill.svg'
import SpeakerSlash from '@/components/Music/icons/speaker.slash.fill.svg'
import Speaker from '@/components/Music/icons/speaker.fill.svg'
import SpeakerWave from '@/components/Music/icons/speaker.wave.3.fill.svg'

export default {
  name: 'ControlIcon',
  components: {
    Play,
    PlayCircle,
    Pause,
    Forward,
    Backward,
    ForwardEnd,
    BackwardEnd,
    SpeakerSlash,
    Speaker,
    SpeakerWave
  },
  props: {
    name: {
      type: String,
      default: 'playPause',
    },
    animate: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: false,
    },
    circle: {
      type: Boolean,
      default: false,
    },
    size: {
      type: Number,
      default: 75,
    },
    scale: {
      type: Number,
      default: 1,
    },
    mirror: {
      type: Boolean,
      default: false,
    },
    pulse: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      variables,
      icons: {
        playPause: {
          // active: `M12,10 L15,10 ${this.radius(1, 1, 1)} L16,25 ${this.radius(1, -1, 1)} L13,26 ${this.radius(1, -1, -1)} L12,11 ${this.radius(1, 1, -1)} M21,10 L24,10 ${this.radius(1, 1, 1)} L25,25 ${this.radius(1, -1, 1)} L22,26 ${this.radius(1, -1, -1)} L21,11 ${this.radius(1, 1, -1)}`,
          // inactive: `M12,10 L19,13.74 ${this.radius(0, 0, 0)} L19,22.28 12,26 M19,13.74 L27,18 27,18 19,22.28`,
          active: 'M12,10 L16,10 16,26 12,26 M21,10 L25,10 25,26 21,26',
          inactive: 'M12,10 L19,13.74 19,22.28 12,26 M19,13.74 L27,18 27,18 19,22.28',
        },
        skip: {
          active: 'M11,10 L24,18 24,18 11,26 M22,10 L26,10 26,26 22,26',
          inactive: 'M11,12 L21,18 21,18 11,24 M20,12 L30,18 30,18 20,24',
        },
      },
      viewBox: 36,
    }
  },
  methods: {
    iconPath(state) {
      return this.icons[this.name][state ? 'active' : 'inactive']
    },
    radius(r, x, y) {
      return `a${r},${r} 0 0 1 ${x}, ${y}`
    },
  },
  watch: {
    active() {
      this.$refs['animate']?.beginElement()
    },
  },
}
</script>

<style lang="scss" scoped>
button {
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0;
  border: 0;
  outline: none;
  background: initial;
  color: inherit;
  -webkit-tap-highlight-color: transparent;
  cursor: inherit;
  &.circle {
    background: currentColor;
    border-radius: var(--button-size-small);
    width: var(--button-size-small);
    height: var(--button-size-small);
    svg {
      color: #ffffff
    }
  }

  &.static {
    --touch-factor: 1;
    transform: scale(calc(var(--scale, 1) * var(--touch-factor)));
    @media screen and (pointer: coarse), (pointer: none) {
      --touch-factor: 1.5;
    }
  }
  &.Play {
    svg {
      margin-left: 5%;
    }
  }
  button:not(.static) svg {
    width: var(--size, 75px);
    height: auto;
  }
  svg, path {
    z-index: 1000;
    fill: currentColor;
  }
}
</style>
