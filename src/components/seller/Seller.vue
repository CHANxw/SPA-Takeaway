<template>
  <div class="seller" ref="contentSeller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score" class="star"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span><span class="">元</span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span><span class="">元</span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span><span class="">分钟</span>
            </div>
          </li>
        </ul>
        <div class="collect-wrapper" @click="collect($event)">
          <span class="icon-favorite" :class="{active: hasCollect}"></span>
          <span class="text">{{collectText}}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper">
          <p class="content border-1px">{{seller.bulletin}}</p>
          <ul v-if="seller.supports" class="supports">
            <li v-for="(item,index) in seller.supports" class="support-item border-1px">
              <span class="icon" :class="classMap[item.type]"></span>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li v-for="info in seller.infos" class="info-item border-1px">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import Star from 'components/star/Star'
  import Split from 'components/split/Split'
  import {saveToLocal, loadFromLocal} from '../../common/js/store'

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        hasCollect: (() => {
          return loadFromLocal(this.seller.id, 'hasCollect', false)
        })()
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
    },
    watch: {
      seller () {
        this._initScroll
      }
    },
    mounted () {
      this.scroll = new BScroll(this.$refs.contentSeller, {
        click: true
      })
      if (this.seller.pics) {
        let len = this.seller.pics.length
        let picWidth = 120
        let marginRight = 6
        let width = (picWidth + marginRight) * len - marginRight
        this.$refs.picList.style.width = `${width}px`
        this.$nextTick(() => {
          this.picScroll = new BScroll(this.$refs.picWrapper, {
            scrollX: true
          })
        })
      }
    },
    methods: {
      _initScroll () {
        this.scroll.refresh()
      },
      collect (e) {
        if (!e._constructed) {
          return
        }
        this.hasCollect = !this.hasCollect
        saveToLocal(this.seller.id, 'hasCollect', this.hasCollect)
      }
    },
    computed: {
      collectText () {
        return this.hasCollect ? '已收藏' : '收藏'
      }
    },
    components: {
      Star,
      Split
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import '../../common/stylus/mixin.styl'
  .seller
    position: absolute
    top: 174px
    left: 0
    width: 100%
    bottom: 0
    overflow: hidden
    .overview
      position: relative
      margin: 0 18px
      padding: 18px 0
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .desc
        padding-bottom: 18px
        border-1px(rgba(7, 17, 27, 0.1))
        .star
          display: inline-block
          vertical-align: top
          margin-right: 8px
        .text
          vertical-align: top
          padding-right: 12px
          line-height: 18px
          font-size: 10px
          color: rgb(77, 85, 93)
      .remark
        display: flex
        margin-top: 18px
        text-align: center
        .block
          flex: 1
          border-right: 1px solid rgba(7, 17, 27, 0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 4px
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7, 17, 27)
            .stress
              font-size: 24px
      .collect-wrapper
        position: absolute
        right: 0
        top: 18px
        width: 36px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          font-size: 24px
          color: rgb(77, 85, 93)
          &.active
            color: rgb(240, 20, 20)
        .text
          font-size: 10px
          line-height: 10px
          color: rgb(77, 85, 93)
    .bulletin
      margin: 0 18px
      padding-top: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .content-wrapper
        .content
          padding: 0 12px 16px 12px
          line-height: 24px
          font-size: 12px
          color: rgb(240, 20, 20)
          border-1px(rgba(7, 17, 27, 0.1))
        .supports
          .support-item
            padding: 16px
            border-1px(rgba(7, 17, 27, 0.1))
            font-size: 0
            &:last-child
              border-none()
            .icon
              display: inline-block
              vertical-align: top
              width: 16px
              height: 16px
              margin-right: 6px
              background-size: 16px 16px
              background-repeat: no-repeat
              &.decrease
                bg-image('decrease_4')
              &.discount
                bg-image('discount_4')
              &.guarantee
                bg-image('guarantee_4')
              &.invoice
                bg-image('invoice_4')
              &.special
                bg-image('special_4')
            .text
              line-height: 16px
              font-size: 12px
    .pics
      padding: 18px
      .title
        margin-bottom: 12px
        line-height: 14px
        font-size: 14px
        color: rgb(7, 17, 27)
      .pic-wrapper
        width: 100%
        overflow: hidden
        white-space: nowrap
        .pic-list
          font-size: 0
          .pic-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      margin: 18px 18px 0 18px
      color: rgb(7, 17, 27)
      .title
        padding-bottom: 12px
        line-height: 14px
        font-size: 14px
        border-1px(rgba(7, 17, 27, 0.1))
      .info-item
        padding: 16px 12px
        border-1px(rgba(7, 17, 27, 0.1))
        line-height: 16px
        font-size: 12px
        &:last-child
          border-none()
</style>
