// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import $ from 'jquery'
window.$ = $;
window.jQuery = $;
import axios from './http/http'
import store from './store'
import ElementUI, { Loading } from 'element-ui'

Vue.config.productionTip = false;
Vue.prototype.$axios = axios;
Vue.use(ElementUI);

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.min.js'
import 'font-awesome/css/font-awesome.css'
import 'admin-lte/dist/css/AdminLTE.min.css'
import 'admin-lte/dist/css/skins/_all-skins.min.css'
import 'element-ui/lib/theme-chalk/index.css'

import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
Vue.use(mavonEditor);

import VeLine from 'v-charts/lib/line.common'
import VePie from 'v-charts/lib/pie.common'
Vue.component(VeLine.name, VeLine);
Vue.component(VePie.name, VePie);

import * as filters from './filters/index'

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
