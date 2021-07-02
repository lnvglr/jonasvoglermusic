<template>
  <div v-if="festivals" class="festivals">
    <Festival v-for="(festival, i) in festivals" :key="i" :festival="festival" :small="small" />
  </div>
</template>

<script>
import Festival from '@/components/Project/Festival.vue'
export default {
  name: 'Details',
  components: {
    Festival,
  },
  props: {
    festivals: [Array, Boolean],
    small: {
      type: Boolean,
      default: false
    }
  },
}
</script>

<style lang="scss">
.festivals {
  .content & {
    --shadow: 0px 2px 3px rgb(0 0 0 / 40%), 0px 10px 20px rgb(0 0 0 / 100%);
    align-items: flex-end !important;
    justify-content: flex-start !important;
    margin: -10px;
    width: 100%;
    flex-direction: column;
    flex-shrink: 1;
    text-shadow: var(--shadow);
  }
  .project-content & {
    margin-top: 2rem;
    padding: 20px;
  }
}
</style>
<style lang="scss" scoped>
.festivals {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}
</style>
