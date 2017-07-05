var express = require('express')
var config = require('./config/index')

var port = process.env.PORT || config.build.port // 端口
var app = express()
var router = express.Router() // 设置路由

router.get('/', function (req, res, next) {
  req.url = './index.html' // 确定打开路径文件
  next() // 执行
})

app.use(router)

var appData = require('./data.json')
var seller = appData.seller
var goods = appData.goods
var ratings = appData.ratings

var apiRouter = express.Router()
apiRouter.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data:　seller,
  })
})
apiRouter.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data:　goods,
  })
})
apiRouter.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data:　ratings,
  })
})
app.use('/api', apiRouter)

app.use(express.static('./dist'))

module.exports = app.listen(port, function (err) {
  if (err) {
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
