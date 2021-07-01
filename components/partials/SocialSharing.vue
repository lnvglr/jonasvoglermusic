<template>
  <div>
    <ShareNetwork
      v-for="(network, index) in networks"
      :key="index"
      :network="network"
      :url="project.link"
      :title="project.title.rendered"
      :description="description"
      :media="project.thumbnail['cinema-small'][0]"
      :hashtags="hashtags.join(',')"
      >share on {{ network }}&emsp;
    </ShareNetwork>
    <a href="javascript:void(0)" @click="copyToClipboard(project.link)">{{copy}}</a>
  </div>
</template>

<script>
import { ShareNetwork } from 'vue-social-sharing'

export default {
  name: 'SocialSharing',
  components: {
    ShareNetwork,
  },
  props: {
    project: Object,
  },
  data() {
    return {
      networks: ['pinterest', 'reddit', 'twitter'],
      hashtags: [],
      copy: 'copy link',
    }
  },
  computed: {
    description() {
      return this.project?.excerpt.rendered?.replace(/<[^>]*>?/gm, '') || ''
    },
  },
  methods: {
    copyToClipboard(text) {
      const temp = this.copy
      if (window.clipboardData && window.clipboardData.setData) {
        // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
        return window.clipboardData.setData('Text', text)
      } else if (document.queryCommandSupported && document.queryCommandSupported('copy')) {
        var textarea = document.createElement('textarea')
        textarea.textContent = text
        textarea.style.position = 'fixed' // Prevent scrolling to bottom of page in Microsoft Edge.
        document.body.appendChild(textarea)
        textarea.select()
        try {
          document.execCommand('copy') // Security exception may be thrown by some browsers.
          this.copy = 'copied'
          setTimeout(() => {
            this.copy = temp
          }, 1000)
          return
        } catch (ex) {
          console.warn('Copy to clipboard failed.', ex)
          return false
        } finally {
          document.body.removeChild(textarea)
        }
      }
    },
  },
  mounted() {
    this.hashtags.push(this.project.field?.genre?.name)
  },
}
</script>

<style lang="scss" scoped>
div {
  display: flex;
  justify-content: center;
}
</style>
