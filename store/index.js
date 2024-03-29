export const state = () => ({
  bloginfo: null,
  filter: [],
  experimental: true,
  reelTimeStamp: 0,
  reelPlaying: false,
  cookieConsent: false
});

// getters
export const getters = {
  getBloginfo: state => state.bloginfo,
  getReelTimeStamp: state => state.reelTimeStamp,
  getReelPlaying: state => state.reelPlaying,
  filter: state => state.filter,
  getExperimental: state => state.experimental,
  getCookieConsent: state => state.cookieConsent
};
// actions
export const actions = {
  setReelPlaying({ commit }, playing) {
    commit("setReelPlaying", playing);
  },
  updateReelTimeStamp({ commit }, timeStamp) {
    commit("updateReelTimeStamp", timeStamp);
  },
  setBloginfo({ commit }, info) {
    commit("setBloginfo", info);
  },
  setCookieConsent({ commit }, value) {
    commit("setCookieConsent", value);
  },
  updateFilter({ commit }, slug) {
    commit("updateFilter", slug);
  },
  toggleExperimental({ commit }) {
    commit("toggleExperimental");
  },
  changeRoute({ commit }, slug) {
    const fullPath = slug ? $nuxt.context.env.projectPath + slug : "/";
    history.pushState({}, null, fullPath);
    $nuxt.$route.params.projectSlug = slug;
    commit("project/setOpen", slug);
  }
};

// mutations
export const mutations = {
  setProjectPath(state, path) {
    state.projectPath = path;
  },
  setBloginfo(state, info) {
    state.bloginfo = info;
  },
  setReelPlaying(state, playing) {
    state.reelPlaying = playing;
  },
  updateReelTimeStamp(state, timeStamp) {
    state.reelTimeStamp = timeStamp;
  },
  setCookieConsent(state, value) {
    state.cookieConsent = value;
  },
  toggleExperimental(state) {
    state.experimental = !state.experimental;
  },
  updateFilter(state, slug) {
    if (!slug) return (state.filter = []);
    if (state.filter.includes(slug)) {
      state.filter = state.filter.filter(item => item !== slug);
    } else {
      // state.filter.push(slug);
      state.filter = [slug];
    }
  }
};
