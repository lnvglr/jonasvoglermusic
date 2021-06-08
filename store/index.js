import api from "@/api";

export const state = () => ({
  bloginfo: null,
	openProject: null,
	open: null,
	filter: []
});

// getters
export const getters = {
  getBloginfo: state => state.bloginfo,
	openProject: state => state.openProject,
	filter: state => state.filter
};
// actions
export const actions = {
  fetchBloginfo({ commit }) {
    api.get('bloginfo', {}, (info) => {
      commit('setBloginfo', info)
    });
  },
  setBloginfo({ commit }, info) {
		commit('setBloginfo', info)
  },
  setOpen({ commit }, slug) {
		commit('setOpen', slug)
  },
  updateFilter({ commit }, slug) {
		commit('updateFilter', slug)
	},
  clearFilter({ commit }, slug) {
		commit('clearFilter', slug)
	},
};

// mutations
export const mutations = {
  setBloginfo(state, info) {
    state.bloginfo = info;
  },
  setOpen(state, slug) {
    state.openProject = slug;
  },
  clearFilter(state) {
		state.filter = []
	},
  updateFilter(state, slug) {
		if (state.filter.includes(slug)) {
			state.filter = state.filter.filter(item => item !== slug)
		} else {
			state.filter.push(slug)
		}
  },
  changeRoute(state, slug) {
    const fullPath = slug !== "" ? "/project/" + slug : "/";
    history.pushState({}, null, fullPath);
    $nuxt.$route.params.projectSlug = slug;
    state.project = slug;
  }
};
