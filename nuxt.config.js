const getSitemap = require("./utils/getSitemap.js");
const fs = require("fs");
const packageJson = fs.readFileSync("./package.json");
const version = JSON.parse(packageJson).version || 0;
const apiBase = "https://api.jonasvoglermusic.com/wp-json/wp/v2/";
const host = "https://jonasvoglermusic.com";
const projectPath = "/project/";

module.exports = {
  // Target: https://go.nuxtjs.dev/config-target
  target: "server",
  // Serve modern bundle to modern browsers to reduce legacy JS
  modern: process.env.NODE_ENV === 'production' ? 'client' : false,
  rootDir: process.cwd(),
  env: {
    API_BASE_PATH: apiBase,
    HOST_NAME: host,
    PACKAGE_VERSION: version,
    projectPath,
    GTAG_ID: process.env.GTAG_ID || "G-4ERRMFBFD4",
  },

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    title: "Jonas Vogler – Film Composer for Feature, Documentary & Advertising in Berlin",
    htmlAttrs: {
      lang: "en"
    },
    meta: [
      { charset: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover"
      },
      {
        hid: "description",
        name: "description",
        content: "Jonas Vogler composes original scores for film, TV and advertising. Discover his work across feature film, documentary and commercial."
      }
    ],
    link: [
      { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      // Connection hints for faster image and font fetching
      { rel: 'preconnect', href: 'https://api.jonasvoglermusic.com', crossorigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://api.jonasvoglermusic.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
      { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
    ]
  },

  router: {
    extendRoutes(routes, resolve) {
      routes.push(
        {
          name: "Project",
          path: `${projectPath}:projectSlug`,
          component: resolve(__dirname, "pages/index.vue")
        },
        {
          name: 'PageCatchAll',
          path: '/:slug',
          component: resolve(__dirname, 'pages/_slug.vue')
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
    { src: "~/plugins/vue-meta", mode: "client" },
    { src: "~/plugins/scroll-behavior-polyfill", mode: "client" },
    { src: "~/plugins/idle-vue", mode: "client" },
    { src: "~/plugins/vue-cookie-law", mode: "client" },
    { src: "~/plugins/vue-gtag", mode: "client" },
    { src: "~/plugins/block-foreign-gtag", mode: "client" },
    // Ensure consent runs last so it can finalize GA state
    { src: "~/plugins/ga-consent", mode: "client" },
    { src: "~/plugins/vue-loadscript", mode: "client" }
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    "@nuxtjs/axios",
    "@nuxtjs/style-resources",
    "@nuxtjs/sitemap",
    "nuxt-svg-loader"
  ],

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
    publicPath: "/public",
    extractCSS: true
  },
  server: {
    // host: '0.0.0.0'
  },
  devServer: {
    clientLogLevel: "silent"
  },

  // Sitemap
  sitemap: {
    hostname: host,
    gzip: true,
    routes() {
      return getSitemap(apiBase, projectPath);
    },
    defaults: {
      changefreq: "weekly",
      priority: 1,
      lastmod: new Date()
    }
  }
};
