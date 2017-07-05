<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <router-link class="tab-item" to="/goods">商品</router-link>
      <router-link class="tab-item" to="/ratings">评价</router-link>
      <router-link class="tab-item" to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller" keep-alive></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import Header from 'components/header/Header'
  import {urlParse} from './common/js/util'

  export default {
    name: 'app',
    data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created () {
      // Object.assign方法可以给已有对象添加属性，具体看Vue关于深入响应式的原理
      this.$http.get('static/data.json?id=' + this.seller.id).then(res => {
        this.seller = Object.assign({}, this.seller, res.data.seller)
      })
    },
    components: {
      'v-header': Header
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./common/stylus/mixin.styl"
  #app
    .tab
      display: flex
      width: 100%
      height: 40px
      line-height: 40px
      border-1px(rgba(7, 17, 27, 0.1))
      .tab-item
        flex: 1
        text-align: center
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)
</style>
