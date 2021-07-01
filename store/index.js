import api from "@/api";

export const state = () => ({
  bloginfo: null,
  filter: [],
  experimental: false
});

// getters
export const getters = {
  getBloginfo: state => state.bloginfo,
  filter: state => state.filter,
  getExperimental: state => state.experimental
};
// actions
export const actions = {
  fetchBloginfo({ commit }) {
    api.get("bloginfo", {}, info => {
      commit("setBloginfo", info);
    });
  },
  setBloginfo({ commit }, info) {
    commit("setBloginfo", info);
  },
  updateFilter({ commit }, slug) {
    commit("updateFilter", slug);
  },
  toggleExperimental({ commit }) {
    commit("toggleExperimental");
  },
  changeRoute({ commit }, slug) {
    const fullPath = slug ? "/project/" + slug : "/";
    history.pushState({}, null, fullPath);
    $nuxt.$route.params.projectSlug = slug;
    commit("project/setOpen", slug);
  }
};

// mutations
export const mutations = {
  setBloginfo(state, info) {
    state.bloginfo = info;
  },
  toggleExperimental(state) {
    state.experimental = !state.experimental;
  },
  updateFilter(state, slug) {
    if (!slug) return state.filter = []
    if (state.filter.includes(slug)) {
      state.filter = state.filter.filter(item => item !== slug);
    } else {
      state.filter = [slug];
    }
  },
};
