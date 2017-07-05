// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'

import './common/stylus/index.styl'

Vue.prototype.$http = axios
Vue.config.productionTip = false
// 首页登录显示的路由地址
router.push('/goods')
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  data () {
    return {
      Bus: new Vue()
    }
  },
  template: '<App/>',
  components: { App }
})
