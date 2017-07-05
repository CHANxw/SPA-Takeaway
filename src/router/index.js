import Vue from 'vue'
import Router from 'vue-router'
import Goods from 'components/goods/Goods'
import Seller from 'components/seller/Seller'
import Ratings from 'components/ratings/Ratings'

Vue.use(Router)

export default new Router({
  routes: [{
    path: '/goods',
    component: Goods
  }, {
    path: '/seller',
    component: Seller
  }, {
    path: '/ratings',
    component: Ratings
  }
  ],
  // 设置当router 选中后的样式名称为active
  linkActiveClass: 'active'
})
