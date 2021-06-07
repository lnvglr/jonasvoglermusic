<template>
  <div :class="page.name">
    <h1 v-if="page.title">{{ page.title.rendered }}</h1>
    <div class="page-content page-table" v-if="page.content" v-html="page.content.rendered">
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    page: Object
  }
}
</script>

<style lang="scss">
.page-table {
  display: grid;
  grid-template-columns: 100%;
  grid-row-gap: 2rem;
  grid-column-gap: 2rem;
  h2 {
    grid-column: 1;
    margin-bottom: 0;
    margin-top: 0.25rem;
  }
  h3, ul, ol, p {
    grid-column: 1;
  }
  @media screen and (min-width: map-get($breakpoints, xlarge)) {
    & {
      grid-template-columns: minmax(240px, 3fr) minmax(480px, 5fr);
    }
    h2 {
      grid-column: 1 / 2;
    }
    h3, ul, ol, p {
      grid-column: 2 / 3;
    }
  }
}
</style>
