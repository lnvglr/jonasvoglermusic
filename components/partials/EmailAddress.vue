<template>
  <a class="mail" @mouseover="this.scambleAddress" :href="this.url">{{this.label}}</a>
</template>

<script>

export default {
  name: 'Email',
  props: {
    address: String,
    placeholder: {
      type: String,
      default: 'Shoot me an email!'
    }
  },
  data () {
    return {
      label: this.placeholder,
      url: '#'
    }
  },
  methods: {
    scambleAddress: function () {
      this.label = this.address
      this.url = 'mailto:' + this.address
    }
  }
}
</script>
