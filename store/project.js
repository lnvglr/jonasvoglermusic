import api from "@/api";

// initial state
export const state = () => ({
  projects: [],
	open: null
});

// getters
export const getters = {
  get: state => id => {
    const field = typeof id === "number" ? "id" : "slug";
    const project = state.projects.filter(project => project[field] === id);
    return project[0] || false;
  },
  recent: state => limit => {
    if (!limit || !Number.isInteger(limit) || typeof limit == "undefined") {
      return state.projects;
    }
    let recent = state.projects;
    return recent.slice(0, limit);
  },
  all: state => state.projects,
  open: state => state.open
};

// actions
export const actions = {
  getProjects({ commit }, { limit }) {
    api.get(
      "posts",
      {
        per_page: limit,
        orderby: "menu_order",
        order: "asc"
      },
      projects => {
        // projects.map((project, i) => {
        // 	projects[i] = createProjectSlug(project);
        // });
        commit('setProjects', projects);
      }
    );
  },
  setProjects({ commit }, projects) {
    commit('setProjects', projects)
  },
  setOpen({ commit }, slug) {
		commit('setOpen', slug)
  },
};

// mutations
export const mutations = {
  setProjects(state, projects) {
    state.projects = projects;
  },
  setOpen(state, slug) {
    state.open = slug;
  },
};
