import Vue from 'vue'
import 'export-json-excel'
import { Bar } from 'vue-chartjs/legacy'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import './permission' // permission control
import VueI18n from 'vue-i18n'
import {ValidationObserver, ValidationProvider, extend, VeeValidate, localize} from 'vee-validate'
import "./vee-validate";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue'


Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);

// import './stylus/main.styl'
import store from './store'
import "./scss/app.scss"

Vue.use(VueI18n)

store.dispatch('layout/getSidebar')

const files = require.context('./', true, /\.vue$/i)
files.keys().map(key => Vue.component(key.split('/').pop().split('.')[0], files(key).default))

const lang = document.documentElement.lang.substr(0, 5)
const moment = require('moment')

moment.locale('es')

Vue.use(require('vue-moment'), {
	moment
})

const i18n = new VueI18n({
  locale: lang, // set locale
})

Vue.config.productionTip = false

new Vue({
  router,
  vuetify,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app')

i18n.locale = 'es'
