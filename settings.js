const build = process.env.NODE_ENV === 'production'
const relativeBase = 'jonasvoglermusic'
let apiBasePath = process.env.API_BASE_PATH

export function setApiBasePath (path) {
  apiBasePath = path
}

export default {
  // How many different dispatched actions determine loading progress
  // This is likely determined by how many dispatched actions you have below
  // in the created() method
  LOADING_SEGMENTS: 10,
  API_BASE_PATH: apiBasePath,
  // API_BASE_PATH: build ? apiBasePath : '/' + relativeBase + apiBasePath,
  ROUTER_BASE: build ? '' : relativeBase
}
