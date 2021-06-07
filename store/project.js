import api from "@/api";

// initial state
export const state = () => ({
  projects: [],
	open: ''
});

// getters
export const getters = {
  recentProjects: state => limit => {
    if (!limit || !Number.isInteger(limit) || typeof limit == "undefined") {
      return state.recent;
    }
    let recent = state.recent;
    return recent.slice(0, limit);
  },
  allProjects: state => state.all,

  recentProjectsLoaded: state => state.loaded,
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
