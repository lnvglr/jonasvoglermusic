<template>
  <div class="festival-container" :class="{ small, active }" :style="`--delay: ${delay}ms`">
    <div v-html="laurel" class="laurel-part"></div>
    <div class="festival" v-if="festival.placement">
      <span class="placement">{{ festival.placement }}</span>
      <span class="category" v-if="festival.category">{{ festival.category }}</span>
      <span>
        <span class="title" v-if="festival.title">{{ festival.title }}</span>
        <span class="subtitle" v-if="festival.subtitle"> – {{ festival.subtitle }}</span>
      </span>
      <span class="year" v-if="festival.year">{{ festival.year }}</span>
    </div>

    <div class="festival" v-else>
      <span class="title" v-if="festival.title">{{ festival.title }}</span>
      <span class="subtitle" v-if="festival.subtitle">{{ festival.subtitle }}</span>
      <span class="year" v-if="festival.year">{{ festival.year }}</span>
    </div>
    <div v-html="laurel" class="laurel-part mirror"></div>
  </div>
</template>

<script>
export default {
  name: 'Details',
  props: {
    festival: Object,
    small: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    delay: {
      type: Number,
      default: 100
    }
  },
  computed: {
    laurel() {
      return `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="415.4px" height="801.7px" viewBox="0 0 415.4 801.7" style="enable-background:new 0 0 415.4 801.7;" xml:space="preserve">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#laurel"/>
      </svg>`
    },
  },
}
</script>

<style lang="scss" scoped>
.festival-container {
  display: flex;
  align-items: center;
  margin: 10px;
  letter-spacing: $letter-spacing;
  opacity: 1;
  transition: $slow-02 $expressive;
  transition-delay: var(--delay);
  .festival {
    display: flex;
    flex-direction: column;
    text-align: center;
    min-width: 150px;
    max-width: 200px;
    margin: 0 10px;
    font-size: 1rem;
    line-height: 1.2;
    .placement {
      font-weight: bold;
    }
    .category,
    .year {
      font-size: 0.75rem;
    }
  }
  .laurel-part {
    --laurel-translate: 0;
    --laurel-rotate: 0deg;
    --laurel-scale: 1, 1;
    display: flex;
    width: 1.75rem;
    transition: $extraslow-01 $expressive;
    transition-delay: var(--delay);
    transform: translateY(var(--laurel-translate)) rotate(var(--laurel-rotate))
      scale(var(--laurel-scale));
    &.mirror {
      --laurel-scale: -1, 1;
    }
    &::v-deep svg {
      height: 100%;
      & * {
        fill: currentColor;
      }
    }
  }
  &.small {
    .festival {
      line-height: 1;
      .title,
      .subtitle,
      .placement {
        font-size: 0.75rem;
      }
      .category,
      .year {
        display: none;
      }
    }
    .laurel-part {
      width: 1.25rem;
    }
  }
  &:not(.active) {
    opacity: 0;
    transition: $slow-01 $expressive;
    transform: translateY(0.5rem);
    .laurel-part {
      --laurel-translate: 0.5em;
    }
    .laurel-part:first-child {
      --laurel-rotate: -15deg;
    }
    .laurel-part:last-child {
      --laurel-rotate: 15deg;
    }
  }
  @media screen and (max-width: map-get($breakpoints, medium)) {
    .festival {
      font-size: 0.75rem;
      .category,
      .year {
        font-size: 0.625rem;
      }
    }

    &.small {
      .festival {
        .title,
        .subtitle,
        .placement {
          font-size: 0.675rem;
        }
      }
    }
    .laurel-part {
      width: 1.125rem;
    }
  }
}
</style>

<style lang="scss">
.experimental {
  .festival-container {
    .festival {
      .placement {
        font-family: var(--font-family-bold);
      }
    }
  }
}
</style>
