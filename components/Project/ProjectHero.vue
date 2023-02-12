<template>
  <div>
    <LazyImage
      v-if="project.thumbnail && project.thumbnail['cinema-small']"
      :class="hero.type"
      :lazySrc="project.thumbnail['cinema-small'][0]"
      :lazySrcset="srcSet"
      :alt="project.title.rendered"
      @loaded="heroLoaded"
    />
    <transition name="slide-in" mode="out-in">
      <div ref="hero-container" v-if="open && hero.type" class="hero-container">
        <div v-if="reel" class="mute-sheet" :class="!muted && 'pointerevents-none'" @click="handleMute()">
          <transition
            tag="div"
            name="fade"
            class="mute-controls"
            :class="{ muted }"
          >
            <ControlIcon
              v-if="muted"
              name="SpeakerWave"
              :scale="2"
            />
          </transition>
        </div>
        <client-only v-if="hero.type === 'vimeo' && cookieConsent">
          <vimeo
            :class="hero.type"
            :video-id="hero.data"
            ref="video"
            @playing="playing"
            @pause="paused"
          ></vimeo>
        </client-only>
        <youtube
          v-if="hero.type === 'youtube' && cookieConsent"
          host="https://www.youtube-nocookie.com"
          :class="hero.type"
          :video-id="hero.data"
          :player-vars="{ rel: 0 }"
          ref="video"
          :nocookie="true"
          @playing="playing"
          @paused="paused"
        ></youtube>
        <figure
          v-else-if="hero.type === 'video_local' || hero.type === 'video_link'"
          ref="video"
        >
          <video
            @playing="updatePlaying"
            @loadeddata="setLoadedData"
            @timeupdate="updateTime"
            @pause="updatePlaying"
            controls
            controlsList="nodownload"
            playsinline
            muted
            :autoplay="reel"
            :class="[hero.type, loadeddata && 'loaded', 'video']"
            :src="hero.data"
            :alt="project.title.rendered"
            :data-id="id"
          ></video>
        </figure>
        <figure v-else-if="hero.type === 'image_link'">
          <img
            :class="hero.type"
            :src="hero.data"
            :alt="project.title.rendered"
          />
        </figure>
        <div
          v-else-if="isExternalVideo && !cookieConsent"
          class="cookie-consent"
          v-html="cookieMessage"
        ></div>
      </div>
    </transition>
  </div>
</template>

<script>
import { Youtube } from "vue-youtube";
import { vueVimeoPlayer } from "vue-vimeo-player";
import { mapGetters } from "vuex";

import LazyImage from "@/components/partials/LazyImage.vue";
import CookieNotice from "@/components/partials/CookieNotice.vue";
import ControlIcon from "@/components/Music/ControlIcon.vue";

export default {
  name: "Hero",
  props: {
    open: Boolean,
    reel: Boolean,
    project: Object,
  },
  components: {
    LazyImage,
    youtube: Youtube,
    vimeo: vueVimeoPlayer,
    ControlIcon,
  },
  data() {
    return {
      id: Math.random().toString(36).substr(2, 9),
      srcSet: "",
      sizes: "",
      hero: {
        type: "",
        data: "",
      },
      muted: true,
      player: null,
      loadeddata: false
    };
  },
  computed: {
    ...mapGetters({
      cookieConsent: "getCookieConsent",
      reelTimeStamp: "getReelTimeStamp",
      reelPlaying: "getReelPlaying",
    }),
    imageSizes() {
      return this.generateSrcSet();
    },
    isExternalVideo() {
      return ["vimeo", "youtube"].includes(this.hero.type);
    },
    cookieMessage() {
      let url;
      switch (this.hero.type) {
        case "youtube":
          url = `https://www.youtube.com/watch?v=${this.hero.data}`;
          break;
        case "vimeo":
          url = `https://vimeo.com/${this.hero.data}`;
          break;
        default:
          url = this.hero.data;
      }
      return CookieNotice.methods.blockedCookies(url);
    },
  },
  mounted() {
    this.$nextTick(function () {
      this.heroType();
      this.heroLoaded();
    });
  },
  methods: {
    getAllVideos() {
      return Array.from(document.querySelectorAll('video'));
    },

    isMounted() {
      return !!this.getAllVideos().find(video => video.dataset.id === this.id);
    },
    setLoadedData(e) {
      this.loadeddata = true

      if (this.reel && this.reelTimeStamp > 5) {
        e.target.currentTime = this.reelTimeStamp - 1;
      }

      e.target.play();
    },
    updateTime(e) {
      this.$store.dispatch('updateReelTimeStamp', e.target.currentTime)
    },
    handleMute() {
      this.muted = !this.muted;
      if (this.$refs.video.children[0]) this.$refs.video.children[0].muted = this.muted;
    },
    heroLoaded(value) {
      const val = this.project.thumbnail ? value : true;
      this.$emit("loaded", val);
    },
    generateSrcSet() {
      const sizes = [
        "thumbnail",
        "cinema-small",
        "cinema-medium",
        "cinema-large",
        "cinema-xlarge",
      ];
      const srcSetTmp = [];
      const sizesTmp = [];
      const sortableThumbnails = [];
      if (this.project.thumbnail) {
        for (const size in this.project.thumbnail) {
          if (sizes.includes(size)) {
            sortableThumbnails.push([
              this.project.thumbnail[size][0],
              this.project.thumbnail[size][1],
            ]);
          }
        }
        sortableThumbnails.sort(function (a, b) {
          return a[1] - b[1];
        });
        sortableThumbnails.forEach(function (thumbnail, i, array) {
          srcSetTmp.push(thumbnail[0] + " " + thumbnail[1] + "w");
          if (i === array.length - 1) {
            sizesTmp.push(thumbnail[1] + "px");
          } else {
            const k = i + 1;
            // sizesTmp.push('(max-width: ' + thumbnail[1] + 'px) ' + thumbnail[1] + 'px');
          }
        });
        this.srcSet = srcSetTmp.join(", ");
        this.sizes = "100vw";
      }
    },
    heroType() {
      if (this.project.field?.hero?.type) {
        const type = this.project.field.hero.type;
        if (this.project.field.hero[type]) {
          this.hero.type = type;
          this.hero.data = this.project.field.hero[type];
        }
      }
    },

    // music
    playing(e) {
      if (this.reel) this.$store.dispatch('setReelPlaying', e)
      this.$emit("playing", true);
    },
    paused() {
      if (this.reel) this.$store.dispatch('setReelPlaying', false)
      this.$emit("playing", false);
    },
    updatePlaying(value) {
      console.log(value)
      if (value.target.paused) {
        this.paused();
      } else {
        this.playing(value.target);
      }
    },
  },
  watch: {
    reelPlaying(val, oldVal) {
      if (this.reel && !val && oldVal) oldVal.pause();
    },
    open() {
      console.log('reel', this.reel)
      if (!this.reel) this.$store.dispatch('setReelPlaying', false)
    },
    imageSizes(val) {
      this.generateSrcSet();
    },
  },
};
</script>

<style lang="scss">
.idle .mute-controls.muted {
  opacity: 0;
}
</style>
<style lang="scss" scoped>
figure {
  margin: 0;
  .video {
    opacity: 0;
    transition: opacity 2s;
    &.loaded {
      opacity: 1;
    }
  }
}
.hero-container {
  width: 100%;
  height: 100%;
  position: absolute;
}
.mute-sheet {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  inset: 0;
  z-index: 1;
  background: hsla(0, 0%, 0%, 0.3);
  cursor: pointer;
  opacity: 0.5;
  transition: $slow-01;
  &:hover {
    opacity: 1;
  }
  &.pointerevents-none {
    pointer-events: none;
  }
}
</style>
