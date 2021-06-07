module.exports = {
  debug: true,
  // Target: https://go.nuxtjs.dev/config-target
  target: "server",

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Jonas Vogler Music",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      {
        hid: "description",
        name: "description",
        content: "Portfolio of Jonas Vogler"
      }
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: "Home",
          path: "/",
          component: resolve(__dirname, "views/RecentProjects.vue")
        },
        {
          name: "Project",
          path: "/project/:projectSlug",
          component: resolve(__dirname, "views/RecentProjects.vue")
        },
        {
          name: "Page",
          path: "/:pageSlug",
          component: resolve(__dirname, "views/Page.vue")
        },
        {
          name: "Not Found",
          path: "*",
          component: resolve(__dirname, "views/404.vue")
        }
      );
    }
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [],

  styleResources: {
    scss: ["~/assets/styles/app.scss"]
  },

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
    "~/plugins/global-variables",
    { src: "~/plugins/vue-meta", mode: "client" },
    { src: "~/plugins/scroll-behavior-polyfill", mode: "client" },
    { src: "~/plugins/idle-vue", mode: "client" },
    { src: "~/plugins/vue-cookie-law", mode: "client" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/style-resources",
    "vue-balance-text/nuxt/module"
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: "/public",
    extractCSS: true
    // babel: {
    //   presets({ envName }) {
    //     return [
    //       [
    //         "@babel/babel-preset-app",
    //         {
    //           corejs: {
    //             version: 3
    //           }
    //         }
    //       ]
    //     ];
    //   }
    // }
  }
  // server: {
  // }
};
