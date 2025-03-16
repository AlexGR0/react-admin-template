const { PROJECT_PATH } = require('./config'); // 引入项目配置文件中的常量
const webpackCommon = require('./webpack.common'); // 引入通用的 Webpack 配置
const { resolve } = require('path'); // 引入 Node.js 的 path 模块
const { merge } = require('webpack-merge'); // 引入 webpack-merge 用于合并配置
const ESLintPlugin = require('eslint-webpack-plugin'); // 引入 ESLint 插件

// 使用 webpack-merge 将通用配置与开发环境配置合并
module.exports = merge(webpackCommon, {
  mode: 'development', // 设置为开发模式
  plugins: [
    // 使用 ESLint 插件检查代码
    new ESLintPlugin({
      extensions: ['js', 'ts'], // 检查的文件扩展名
    }),
  ],
  devServer: {
    // https: true, // 如果需要启用 HTTPS，可以取消注释
    host: '0.0.0.0', // 开发服务器监听的主机地址，0.0.0.0 表示允许外部访问
    port: 8080, // 开发服务器监听的端口
    open: false, // 是否自动打开浏览器
    hot: true, // 启用热模块替换（HMR）
    compress: true, // 启用 gzip 压缩
    historyApiFallback: {
      // 处理 history 路由 404 问题
      disableDotRule: true, // 允许带点的 URL
    },
    client: {
      overlay: {
        errors: true, // 在浏览器中显示编译错误
        warnings: false, // 不显示警告
      },
    },
    static: resolve(PROJECT_PATH, './public'), // 静态文件目录
    // proxy: {
    //   // 代理配置示例
    //   "/api/**": {
    //     target: "https://...", // 目标服务器地址
    //     pathRewrite: { "^/api": "" }, // 重写路径
    //     changeOrigin: true, // 修改请求头中的 origin
    //   },
    // },
  },
});
