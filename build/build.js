require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora') // 在打包过程提示，好比转圈圈等待啥的
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')

var spinner = ora('building for production...') // 传入文案，打包过程用来提示
spinner.start()

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err  // 拷贝build.assetsRoot目录下的文件到编译后build.assetsSubDirectory指的文件下
  webpack(webpackConfig, function (err, stats) { // 进行打包
    spinner.stop() // 打包结束就不用在提示了
    if (err) throw err
    process.stdout.write(stats.toString({ // 然后输出打包后的相应信息
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    )) // 就是说不要直接打开index文件，要先创建一个HTTP服务器
  })
})
