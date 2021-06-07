import Vue from "vue";
Vue.prototype.$projectRoute = {
  slug: "",
  path: "/project/",
  fullPath: "/",
  // changeRoute (slug) {
  //   if (this.slug === slug) return
  //   this.slug = slug
  //   this.fullPath = slug ? this.path + this.slug : '/'
  //   history.pushState({}, null, this.fullPath)
  // }
};
// Vue.prototype.$apiBasePath = 'https://api.jonasvoglermusic.de/wp-json/wp/v2/'
Vue.prototype.$apiBasePath = 'https://jonasvoglermusic.com/wp-json/wp/v2/'

