<template>
  <div class="festival-container">
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
    <div v-html="laurel" class="laurel-part" style="transform: scale(-1, 1);"></div>
  </div>
</template>

<script>
export default {
  name: 'Details',
  props: {
    festival: Object,
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

<style lang="scss">
svg {
  height: 100%;
}
svg * {
  fill: currentColor;
}
.content {
  .festivals {
    margin: -10px;
    width: 100%;
    align-items: flex-end;
    justify-content: flex-start;
    flex-direction: column;
    flex-shrink: 1;
    text-shadow: 0px 2px 3px rgb(0 0 0 / 40%), 0px 5px 15px rgb(0 0 0 / 70%),
      0px 10px 20px rgb(0 0 0 / 100%);
  }
}
</style>

<style lang="scss" scoped>
.festival-container {
  display: flex;
  align-items: center;
  margin: 10px;
  letter-spacing: $letter-spacing;
  .festival {
    display: flex;
    flex-direction: column;
    text-align: center;
    min-width: 150px;
    max-width: 200px;
    margin: 0 10px;
    font-size: 1rem;
    line-height: 1.2;
    // font-weight: bold;
    .placement {
      font-weight: bold;
    }
    .category,
    .year {
      font-size: 0.75rem;
    }
  }
  .laurel-part {
    display: flex;
    width: 30px;
  }
}
</style>
