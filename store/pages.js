import api from "@/api";

// initial state
export const state = () => ({
  all: [],
  header: [],
  footer: []
});

// getters
export const getters = {
  getAllPages: state => state.all,
  getPages: state => position => {
    return state[position]
  },
  getPage: state => id => {
    const field = typeof id === "number" ? "id" : "slug";
    const page = state.all.filter(page => page[field] === id);
    return page[0] || false;
  },
};

// actions
export const actions = {
  fetchAll({ commit }) {
    return api.get('pages', { per_page: 10 }, pages => {
      commit('setPages', pages)
      return pages
    });
  },
  set({ commit }, pages) {
    commit('set', pages)
  },
};

// mutations
export const mutations = {
  set(state, pages) {
    state.all = pages
    state.header = []
    state.footer = []
    pages.forEach(page => {
      Object.values(page?.field?.page_placement).forEach(position => {
        state[position].push(page)
      })
    })
  }
};