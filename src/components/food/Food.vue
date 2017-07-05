<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="foodScroll">
      <div class="food-content">
        <div class="image-header">
          <img :src="food.image" alt="food.description">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <div class="title">{{food.name}}</div>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
          </div>
          <div class="cart-control-wrapper">
            <cart-control :food="food"></cart-control>
          </div>
          <transition name="fade">
            <div class="buy" v-show="!food.count || food.count === 0" @click.stop.prevent="addFirstFood($event)">加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <div class="title">商品介绍</div>
          <p class="text">{{food.info}}</p>
        </div>
        <split v-show="food.info"></split>
        <div class="rating">
          <div class="title">商品评价</div>
          <rating-select :select-type="selectType" :only-content="onlyContent" :desc="desc"
                         :ratings="food.ratings" @select="typeSelect" @switchContent="contentSwitch"></rating-select>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-for="rating in food.ratings" class="rating-item border-1px"
                  v-show="showRating(rating.type, rating.text)">
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img :src="rating.avatar" alt="" class="avatar" height="12" width="12">
                </div>
                <p class="text">
                  <i :class="{'icon-thumb_up': rating.rateType ===0, 'icon-thumb_down': rating.rateType === 1}"></i>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  import Split from 'components/split/Split'
  import CartControl from 'components/cartcontrol/Cartcontrol'
  import {formatDate} from '../../common/js/date'
  import RatingSelect from 'components/ratingselect/Ratingselect'
  import BScroll from 'better-scroll'
  import Vue from 'vue'

  //  const POSITIVE = 0
  //  const NEGATIVE = 1
  const ALL = 2

  export default {
    data () {
      return {
        food: {},
        showFlag: false,
        selectType: ALL,
        onlyContent: true,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      }
    },
    created () {
      this.$root.Bus.$on('foodSelect', food => {
        this.food = food
      })
    },
    methods: {
      show () {
        this.showFlag = true
        this.selectType = ALL  // 每次点开新的食物详情就重置一次
        this.onlyContent = true // 每次点开新的食物详情就重置一次
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.foodScroll, {
              click: true
            })
          } else {
            this.scroll.refresh()
          }
        })
      },
      hide () {
        this.showFlag = false
      },
      addFirstFood (e) {
        if (!e._constructed) {
          return
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1)
          this.$root.Bus.$emit('cartAdd', e.target)
        }
      },
      typeSelect (type) {
        this.selectType = type
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      contentSwitch (boolean) {
        this.onlyContent = boolean
        this.$nextTick(() => {
          this.scroll.refresh()
        })
      },
      showRating (type, text) {
        if (this.onlyContent && !text) {
          return false
        }
        if (this.selectType === ALL) {
          return true
        } else {
          return this.selectType === type
        }
      }
    },
    filters: {
      formatDate (time) {
        let date = new Date(time)
        return formatDate(date, 'yy-MM-dd hh:mm')
      }
    },
    components: {
      CartControl,
      Split,
      RatingSelect
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .food
    position: fixed
    top: 0
    left: 0
    width: 100%
    bottom: 48px // 底部有购物车所以要留空间
    z-index: 30 // 为了能遮住原本内容，又不遮住购物车
    background: #fff
    transition: all 0.3s
    transform: translate3d(0, 0, 0)
    &.move-enter, &.move-leave-to
      transform: translate3d(100%, 0, 0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-bottom: 90%
        img
          position: absolute
          top: 0
          left: 0
          height: 100%
          width: 100%
        .back
          position: absolute
          top: 10px
          left: 0
          .icon-arrow_lift
            display: inline-block
            padding: 10px
            font-size: 20px
            color: #fff
      .content
        position: relative
        padding: 18px
        .title
          margin-bottom: 8px
          line-height: 14px
          font-weight: 700
          font-size: 14px
          color: rgb(7, 17, 27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          height: 10px
          font-size: 0
          color: rgb(147, 153, 159)
          .sell-count, .rating
            font-size: 10px
          .sell-count
            margin-right: 12px
        .price
          line-height: 24px
          font-weight: 700
          .now
            margin-right: 8px
            font-size: 14px
            color: rgb(240, 20, 20)
          .old
            font-size: 10px
            text-decoration: line-through
            color: rgb(147, 153, 159)
        .cart-control-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          box-sizing: border-box
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          border-radius: 12px
          font-size: 10px
          color: #fff
          background: rgb(0, 160, 220)
          transition: all 0.1s
          opacity: 1
          &.fade-enter, &.fade-leave-to
            opacity 0
      .info
        padding: 18px
        .title
          margin-bottom: 6px
          line-height: 14px
          font-size: 14px
          font-weight: 700
          color: rgb(7, 17, 27)
        .text
          padding: 0 8px
          line-height: 24px
          font-size: 12px
          color: rgb(77, 85, 93)
      .rating
        padding-top: 18px
        .title
          margin-left: 18px
          line-height: 14px
          font-weight: 700
          font-size: 14px
          color: rgb(7, 17, 27)
        .rating-wrapper
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7, 17, 27, 0.1))
            .user
              position: absolute
              top: 16px
              right: 0
              line-height: 12px
              font-size: 0
              .name
                display: inline-block
                margin-right: 6px
                vertical-align: top
                font-size: 10px
                color: rgb(147, 153, 159)
              .avatar
                border-radius: 50%
            .time
              margin-bottom: 6px
              line-height: 12px
              font-size: 10px
              color: rgb(147, 153, 159)
            .text
              line-height: 16px
              font-size: 12px
              color: rgb(7, 17, 27)
              .icon-thumb_down, icon-thumb_up
                line-height: 16px
                margin-right: 4px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0, 160, 220)
              .icon-thumb_down
                color: rgb(147, 153, 159)
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147, 153, 159)
</style>
