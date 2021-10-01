<template>
  <div>
    <client-only>
      <Player class="player" :soundcloud="soundcloud" />
    </client-only>
    <SocialMedia :links="links" class="social-media" :initialDelay="1000" />
  </div>
</template>

<script>
import Player from '@/components/Music/Player.vue'
import SocialMedia from '@/components/partials/SocialMediaLinks.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'PageMusic',
  components: {
    Player,
    SocialMedia,
  },
  props: {
    page: Object,
    ready: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    ...mapGetters({
      getPage: 'pages/getPage',
    }),
    links() {
      return this.getPage('about-contact')?.field.social_media?.filter((e) =>
        ['bandcamp', 'soundcloud', 'spotify'].some((f) => e.url.includes(f))
      ).map(e => e.url)
    },
    soundcloud() {
      return {
        client_id: this.page?.field?.client_id,
        user_id: this.page?.field?.user_id,
        playlist_id: this.page?.field?.playlist_id,
        playlist_link: this.page?.field?.playlist_link,
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.player {
  transition-delay: $slow-01;
  .fade & {
    opacity: 0;
    &::v-deep {
      .cover {
        opacity: 0;
        transform: scale(0.9);
      }
      .backdrop {
        opacity: 0;
      }
    }
  }
  &::v-deep {
    .backdrop {
      transition-delay: $slow-01;
    }
    .cover {
      transition-delay: $slow-02;
    }
  }
}
.social-media {
  z-index: 5;
  position: relative;
  margin-top: 5rem;
}
</style>
<style lang="scss">
#app.music {
  --body-background: $light-03;
  color: white;
  .wrap.page {
    padding: 0 !important;
  }
  p,
  h2 {
    transition: $slow-02 $productive;
    color: white !important;
  }
  .title-container .string {
    .logo,
    .description {
      transition: $slow-02 $productive;
      color: white !important;
    }
  }
}
footer {
  z-index: 10;
}
</style>
