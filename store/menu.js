// initial state
export const state = () => ({
  header: [],
  footer: []
});

// getters
export const getters = {
  getMenu: state => position => {
    return state[position];
  },
};

// actions
export const actions = {
  set({ commit }, menu) {
    commit("set", menu);
  }
};

// mutations
export const mutations = {
  set(state, menu) {
    state.header = [];
    state.footer = [];
    menu.forEach(page => {
      Object.values(page?.field?.page_placement).forEach(position => {
        state[position].push(page);
      });
    });
  }
};
