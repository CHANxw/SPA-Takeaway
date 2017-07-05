<template>
  <div>
    <div class="shop-cart">
      <div class="content" @click="toggleList">
        <div class="content-left">
          <div class="logo-wrapper">
            <div class="logo" :class="{highlight: totalCount > 0}">
              <i class="icon-shopping_cart" :class="{highlight: totalCount > 0}"></i>
            </div>
            <div class="num" v-show="totalCount > 0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{highlight: totalCount > 0}">￥{{totalPrice}}</div>
          <div class="desc">另需配送费{{deliveryPrice}}</div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
      </div>
      <div class="ball-container">
        <transition-group name="drop"
                          @before-enter="beforeEnter"
                          @enter="enter"
                          @after-enter="afterEnter"
                          tag="div">
          <div class="ball" v-for="(ball, index) in balls" v-show="ball.show" :key="ball">
            <div class="inner inner-hook" key="inner"></div>
          </div>
        </transition-group>
      </div>
      <transition-group name="fold" tag="div">
        <div class="shop-cart-list" v-show="listShow" key="title">
          <div class="list-header">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>
          <div class="list-content" ref="listContent">
            <ul>
              <li class="food" v-for="food in selectFoods" key="food">
                <span class="name">{{food.name}}</span>
                <div class="price">
                  <span>￥{{food.price*food.count}}</span>
                </div>
                <div class="cart-control-wrapper">
                  <cart-control :food="food"></cart-control>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition-group>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>
</template>

<script>
  import BScroll from 'better-scroll'
  import CartControl from '../cartcontrol/Cartcontrol'
  export default {
    props: {
      selectFoods: {
        type: Array,
        default () {
          return [{
            price: 12.5,
            count: 3
          }]
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: false // 用来记录购物车收起或打开的状态
      }
    },
    computed: {
      totalPrice () {
        let total = 0
        this.selectFoods.forEach(food => {
          total += food.price * food.count
        })
        return total
      },
      totalCount () {
        let total = 0
        this.selectFoods.forEach(food => {
          total += food.count
        })
        return total
      },
      payDesc () {
        let result = ''
        let total = this.totalPrice
        let min = this.minPrice
        if (total === 0) {
          result = `￥${min}元起送`
        } else if (total >= min) {
          result = '去结算'
        } else {
          let diff = min - total
          result = `还差${diff}元起送`
        }
        return result
      },
      payClass () {
        if (this.totalPrice >= this.minPrice) {
          return 'enough'
        } else {
          return 'not-enough'
        }
      },
      listShow () {
        if (!this.totalCount) {
          this.fold = true
          return false
        }
        let show = !this.fold
        if (show) {
          this.$nextTick(() => {
            if (!this.scroll) { // 判断有没有实例化过
              this.scroll = new BScroll(this.$refs.listContent, {
                click: true
              })
            } else {
              this.scroll.refresh() // 这样就不用重新实例化了
            }
          })
        }
        return show
      }
    },
    created () {
      this.$root.Bus.$on('cartAdd', el => {
        this.drop(el)
      })
    },
    beforeDestroy () {
      this.$root.Bus.$off('cartAdd', el => {
        this.drop(el)
      })
    },
    methods: {
      drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i]
          if (!ball.show) {
            ball.show = true
            ball.el = el
            this.dropBalls.push(ball)
            return
          }
        }
      },
      beforeEnter (el) {
        let count = this.balls.length
        while (count--) {
          let ball = this.balls[count]
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect()
            let x = rect.left - 32
            let y = -(window.innerHeight - rect.top - 22)
            el.style.display = ''
            el.style.webkitTransform = `translate3d(0, ${y}px, 0)`
            el.style.transform = `translate3d(0, ${y}px, 0)`
            let inner = el.getElementsByClassName('inner-hook')[0]
            inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`
            inner.style.transform = `translate3d(${x}px, 0, 0)`
          }
        }
      },
      enter (el) {
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)'
          el.style.transform = 'translate3d(0,0,0)'
          let inner = el.getElementsByClassName('inner-hook')[0]
          inner.style.webkitTransform = 'translate3d(0,0,0)'
          inner.style.transform = 'translate3d(0,0,0)'
        })
      },
      afterEnter (el) {
        let ball = this.dropBalls.shift()
        if (ball) {
          ball.show = false
          el.style.display = 'none'
        }
      },
      toggleList () {
        if (!this.totalCount) {
          return
        }
        this.fold = !this.fold
      },
      empty () {
        this.selectFoods.forEach(food => {
          food.count = 0 // 清空效果，让所有食物的件数为0
        })
      },
      hideList () {
        this.fold = true
      },
      pay () {
        if (this.totalPrice < this.minPrice) {
          return
        }
        window.alert(`共需支付${this.totalPrice + this.deliveryPrice}元 (配送费${this.deliveryPrice}元)`) // 点击后会出现弹窗，也会出现列表，因为冒泡了所以要阻止冒泡以及默认行为
      }
    },
    components: {
      CartControl
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"
  .shop-cart
    position: fixed
    left: 0
    bottom: 0
    z-index: 50
    width: 100%
    height: 48px
    .content
      display: flex
      background: #141d27
      font-size: 0
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex: 1
        .logo-wrapper
          display: inline-block
          position: relative
          top: -10px
          padding: 6px
          margin: 0 12px
          width: 56px
          height: 56px
          box-sizing: border-box
          vertical-align: top
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            text-align: center
            border-radius: 50%
            background: #2b343c
            &.highlight
              background: rgb(0, 160, 220)
            .icon-shopping_cart
              line-height: 44px //与父元素（.logo）的高度相同就能居中表现了
              color: #80858a
              font-size: 24px
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            padding: 0 2px
            text-align: center
            border-radius: 16px
            border-shadow: 0 4px 2px rgba(0, 0, 0, 0.4)
            font-size: 9px
            font-weight: 700
            color: rgb(255, 255, 255)
            background: rgb(240, 20, 20)
        .price, .desc
          display: inline-block
          box-sizing: border-box
        .price
          margin-top: 12px
          line-height: 24px
          padding-right: 12px
          font-size: 16px
          font-weight: 700
          border-right: 1px solid rgba(255, 255, 255, 0.1)
          &.highlight
            color: #fff
        .desc
          margin-top: 12px
          margin-left: 12px
          line-height: 24px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .pay
          height: 48px
          text-align: center
          line-height: 48px
          font-size: 12px
          font-weight: 700
          &.not-enough
            background: #2b343c
          &.enough
            background: #00b43c
            color: #fff
    .ball-container
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 200
        &.drop-enter-active, &.drop-leave-active
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0, 160, 220)
          transition: all 0.4s linear
    .shop-cart-list
      position: absolute
      top: 0
      left: 0
      width: 100%
      z-index: -1
      transform: translate3d(0, -100%, 0)
      &.fold-enter-active, &.fold-leave-active
        transition all 0.5s
      &.fold-enter, &.fold-leave-to
        transform translate3d(0, 0, 0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 2px solid rgba(7, 17, 27, 0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7, 17, 27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0, 160, 220)
      .list-content
        padding: 0 18px
        max-height: 217px
        overflow: hidden
        background: #fff
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7, 17, 27, 0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7, 17, 27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240, 20, 20)
          .cart-control-wrapper
            position: absolute
            right: 0
            bottom: 6px

  .list-mask
    position: fixed
    top: 0
    left: 0
    height: 100%
    width: 100%
    z-index: 40 // zindex 要小于shop-cart的这样才不会遮住shop-cart
    backdrop-filter: blur(10px)
    opacity: 1
    background: rgba(7, 17, 27, 0.6)
    &.fade-enter-active, &.fade-leave-active
      transition: all 0.4s
    &.fade-enter, &.fade-leave-to
      background: rgba(7, 17, 27, 0)
      opacity: 0
</style>
