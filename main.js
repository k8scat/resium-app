import Vue from 'vue'
import App from './App'
import store from '@/store'
import Copyright from '@/components/copyright.vue'

Vue.component('copyright', Copyright)

Vue.config.productionTip = false

App.mpType = 'app'

Vue.prototype.$store = store

const app = new Vue({
	store,
    ...App
})
app.$mount()
