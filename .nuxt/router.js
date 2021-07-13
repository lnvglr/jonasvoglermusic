import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _1a811e9e = () => interopDefault(import('../views/RecentProjects.vue' /* webpackChunkName: "" */))
const _22d17b4b = () => interopDefault(import('../views/Page.vue' /* webpackChunkName: "" */))
const _658dfdcc = () => interopDefault(import('../views/404.vue' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _1a811e9e,
    name: "Home"
  }, {
    path: "/project/:projectSlug",
    component: _1a811e9e,
    name: "Project"
  }, {
    path: "/:pageSlug",
    component: _22d17b4b,
    name: "Page"
  }, {
    path: "*",
    component: _658dfdcc,
    name: "Not Found"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
