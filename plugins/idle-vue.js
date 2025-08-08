import Vue from 'vue'
import IdleVue from 'idle-vue'

// Use an event emitter as recommended by idle-vue so onIdle/onActive hooks fire
const eventsHub = new Vue()

Vue.use(IdleVue, {
  eventEmitter: eventsHub,
  idleTime: 3000,
})
