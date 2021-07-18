<template>
  <div :class="page.name">
    <h1 v-if="page.title">{{ page.title.rendered }}</h1>
    <div class="page-content page-table" v-if="content" v-html="content"></div>
  </div>
</template>

<script>
export default {
  name: 'PageTable',
  props: {
    page: Object,
  },
  computed: {
    content() {
      if (this.page.content)
        return this.page.content.rendered
          .replace(/(?<=<h2>)(.*?)(?=<\/h2>)/g, '<span>$1</span>')
    },
  },
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
    & > * {
      position: sticky;
      top: 1em;
    }
  }
  h3,
  ul,
  ol,
  p {
    grid-column: 1;
  }
  @media screen and (min-width: map-get($breakpoints, xlarge)) {
    & {
      grid-template-columns: minmax(240px, 3fr) minmax(480px, 8fr);
    }
    h2 {
      grid-column: 1 / 2;
    }
    h3,
    ul,
    ol,
    p {
      grid-column: 2 / 3;
    }
  }
}
</style>
