import Vue from 'vue'
import IdleVue from 'idle-vue'
import Vuex from 'vuex'

const store = new Vuex.Store({})
Vue.use(IdleVue, {
  store,
  idleTime: 3000
})
