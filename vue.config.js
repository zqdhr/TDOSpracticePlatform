const path = require('path')
function resolve (dir) {
  return path.join(__dirname, dir)
}
module.exports = {
   pluginOptions: { // 第三方插件配置
        'style-resources-loader': {
          preProcessor: 'less',
          patterns: [path.resolve(__dirname, 'src/assets/less/style.less')] // less所在文件路径
        }
    },
    chainWebpack:config =>{
      config.plugin('html')
      .tap(args => {
          args[0].title = "实链通";
          return args;
      })
    },
    configureWebpack: {
     // devtool: 'source-map'
    }
 }
