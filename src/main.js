import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import './assets/comment.css'
import 'element-ui/lib/theme-chalk/index.css'
import axios from 'axios'
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

Vue.prototype.axios = axios
Vue.filter('time', (input, value = 'YYYY-MM-DD HH:mm:ss') => {
  return moment(input * 1000).format(value)
})

axios.interceptors.request.use(
  function(config) {
    config.baseURL = 'http://localhost:8888/api/private/v1/'
    config.headers.Authorization = localStorage.getItem('token')
    return config
  },
  function(error) {
    return Promise.reject(error)
  }
)

Vue.use(ElementUI)
Vue.use(VueQuillEditor)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App)
})
