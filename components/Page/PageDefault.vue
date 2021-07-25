<template>
  <div :class="page.name">
    <h1 v-if="page.title">{{ page.title.rendered }}</h1>
    <div class="page-content" v-if="page.content" v-html="page.content.rendered"></div>
  </div>
</template>

<script>
export default {
  name: 'PageDefault',
  props: {
    page: Object,
  },
}
</script>
