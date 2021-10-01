<template>
  <div v-if="festivals" class="festivals" :class="{ active }">
    <Festival
      v-for="(festival, i) in festivals"
      :key="i"
      :delay="delay(i)"
      :festival="festival"
      :small="small"
      :active="active"
    />
  </div>
</template>

<script>
import Festival from '@/components/Project/Festival.vue'
import variables from '@/assets/styles/_variableExport.scss'

export default {
  name: 'Details',
  components: {
    Festival,
  },
  props: {
    festivals: [Array, Boolean],
    small: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      variables,
    }
  },
  methods: {
    delay(i) {
      if (!this.festivals) return 100
      if (!this.variables?.['moderate-01']) return (this.festivals.length - i) * 50
      const duration = Number(this.variables['moderate-01'])
      return (duration / this.festivals.length) * (this.festivals.length - i)
    },
  },
}
</script>

<style lang="scss" scoped>
.festivals {
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin-bottom: 2rem;
}

</style>

<style lang="scss">
.header-copy {
  .festivals {
    @media screen and (max-width: 910px) {
      & > *:nth-child(n + 5) {
        display: none;
      }
    }
    @media screen and (max-width: 780px) {
      & > *:nth-child(n + 3) {
        display: none;
      }
    }
  }
}
</style>
