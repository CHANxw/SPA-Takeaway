/**
 * Created by Administrator on 2017/7/4 0004.
 */
/**
 * 解析url
 * @example ?id=123456&foodId=32
 * @return Object {id: 123456, foodId: 32}
 */
export function urlParse () {
  let url = window.location.search
  let obj = {}
  let reg = /[?&][^?&]+=[^?&]+/g
  // ^非的意思 第一个匹配?或者&，第二个匹配不是&或者?的字符创多个(加号表示匹配多个),然后等于号连接，再匹配参数值(^非?或者&号)
  let arr = url.match(reg)
  if (arr) {
    arr.forEach(item => {
      let tempArr = item.substring(1).split('=')
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      // 因为是url的参数所以要进行decodeURIComponent
      obj[key] = val
    })
  }
  return obj
}
