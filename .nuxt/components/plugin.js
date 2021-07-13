import Vue from 'vue'
import { wrapFunctional } from './utils'

const components = {
  LayoutFooter: () => import('../../components/Layout/Footer.vue' /* webpackChunkName: "components/layout-footer" */).then(c => wrapFunctional(c.default || c)),
  LayoutHeader: () => import('../../components/Layout/Header.vue' /* webpackChunkName: "components/layout-header" */).then(c => wrapFunctional(c.default || c)),
  LayoutLogo: () => import('../../components/Layout/Logo.vue' /* webpackChunkName: "components/layout-logo" */).then(c => wrapFunctional(c.default || c)),
  ProjectFestival: () => import('../../components/Project/Festival.vue' /* webpackChunkName: "components/project-festival" */).then(c => wrapFunctional(c.default || c)),
  ProjectFestivalContainer: () => import('../../components/Project/FestivalContainer.vue' /* webpackChunkName: "components/project-festival-container" */).then(c => wrapFunctional(c.default || c)),
  ProjectNavigateProjects: () => import('../../components/Project/NavigateProjects.vue' /* webpackChunkName: "components/project-navigate-projects" */).then(c => wrapFunctional(c.default || c)),
  Project: () => import('../../components/Project/Project.vue' /* webpackChunkName: "components/project" */).then(c => wrapFunctional(c.default || c)),
  ProjectDetails: () => import('../../components/Project/ProjectDetails.vue' /* webpackChunkName: "components/project-details" */).then(c => wrapFunctional(c.default || c)),
  ProjectHeader: () => import('../../components/Project/ProjectHeader.vue' /* webpackChunkName: "components/project-header" */).then(c => wrapFunctional(c.default || c)),
  ProjectHero: () => import('../../components/Project/ProjectHero.vue' /* webpackChunkName: "components/project-hero" */).then(c => wrapFunctional(c.default || c)),
  ProjectPhantom: () => import('../../components/Project/ProjectPhantom.vue' /* webpackChunkName: "components/project-phantom" */).then(c => wrapFunctional(c.default || c)),
  PageAbout: () => import('../../components/Page/PageAbout.vue' /* webpackChunkName: "components/page-about" */).then(c => wrapFunctional(c.default || c)),
  PageDefault: () => import('../../components/Page/PageDefault.vue' /* webpackChunkName: "components/page-default" */).then(c => wrapFunctional(c.default || c)),
  PageTable: () => import('../../components/Page/PageTable.vue' /* webpackChunkName: "components/page-table" */).then(c => wrapFunctional(c.default || c)),
  PartialsCloseButton: () => import('../../components/partials/CloseButton.vue' /* webpackChunkName: "components/partials-close-button" */).then(c => wrapFunctional(c.default || c)),
  PartialsCookieNotice: () => import('../../components/partials/CookieNotice.vue' /* webpackChunkName: "components/partials-cookie-notice" */).then(c => wrapFunctional(c.default || c)),
  PartialsEmailAddress: () => import('../../components/partials/EmailAddress.vue' /* webpackChunkName: "components/partials-email-address" */).then(c => wrapFunctional(c.default || c)),
  PartialsExperimentalButton: () => import('../../components/partials/ExperimentalButton.vue' /* webpackChunkName: "components/partials-experimental-button" */).then(c => wrapFunctional(c.default || c)),
  PartialsFilterPills: () => import('../../components/partials/FilterPills.vue' /* webpackChunkName: "components/partials-filter-pills" */).then(c => wrapFunctional(c.default || c)),
  PartialsLazyImage: () => import('../../components/partials/LazyImage.vue' /* webpackChunkName: "components/partials-lazy-image" */).then(c => wrapFunctional(c.default || c)),
  PartialsShareButton: () => import('../../components/partials/ShareButton.vue' /* webpackChunkName: "components/partials-share-button" */).then(c => wrapFunctional(c.default || c)),
  PartialsSocialMediaLinks: () => import('../../components/partials/SocialMediaLinks.vue' /* webpackChunkName: "components/partials-social-media-links" */).then(c => wrapFunctional(c.default || c)),
  PartialsSocialSharing: () => import('../../components/partials/SocialSharing.vue' /* webpackChunkName: "components/partials-social-sharing" */).then(c => wrapFunctional(c.default || c)),
  PartialsTransitionExpand: () => import('../../components/partials/TransitionExpand.vue' /* webpackChunkName: "components/partials-transition-expand" */).then(c => wrapFunctional(c.default || c))
}

for (const name in components) {
  Vue.component(name, components[name])
  Vue.component('Lazy' + name, components[name])
}
