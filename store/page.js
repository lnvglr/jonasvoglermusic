import api from "@/api";

// initial state
export const state = () => ({
  pages: {
    all: [],
    header: [],
    footer: []
  }
});

// getters
export const getters = {
  getAllPages: state => state.pages.all,
  getPages: state => position => state.pages[position],
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
};

// mutations
export const mutations = {
  setPages(state, pages) {
    state.pages.all = pages
    pages.forEach(page => {
      Object.values(page?.field?.page_placement).forEach(position => {
        state.pages[position].push(page)
      })
    })
  }
};
