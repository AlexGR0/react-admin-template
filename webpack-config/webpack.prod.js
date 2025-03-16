const { PROJECT_PATH } = require('./config'); // 引入项目配置文件中的常量
const webpackCommon = require('./webpack.common');
const { resolve } = require('path');
const glob = require('glob'); // 引入 glob 模块，用于匹配文件路径
const { merge } = require('webpack-merge'); // 引入 webpack-merge 用于合并配置
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 引入 CleanWebpackPlugin 插件，用于清理输出目录
const PurgeCSSPlugin = require('purgecss-webpack-plugin'); // 引入 PurgeCSSPlugin 插件，用于移除未使用的 CSS
const CompressionPlugin = require('compression-webpack-plugin'); // 引入 CompressionPlugin 插件，用于压缩文件（如 Gzip）
const TerserWebpackPlugin = require('terser-webpack-plugin'); // 引入 TerserWebpackPlugin 插件，用于压缩 JavaScript 代码
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // 引入 CssMinimizerPlugin 插件，用于压缩 CSS 代码

// 使用 webpack-merge 将通用配置与生产环境配置合并
module.exports = merge(webpackCommon, {
  mode: 'production', // 设置为生产模式
  plugins: [
    // 清理输出目录，确保每次构建前目录是干净的
    new CleanWebpackPlugin(),

    // 移除未使用的 CSS
    new PurgeCSSPlugin({
      paths: glob.sync(`${resolve(PROJECT_PATH, './src')}/**/*`, {
        nodir: true, // 只匹配文件，忽略目录
      }),
      only: ['dist'], // 只处理 dist 目录
      // safelist: {
      //   standard: [/^ant-/], // 如果需要保留某些 CSS 类（如 antd 的类），可以配置 safelist
      // },
    }),

    // 压缩文件（如 Gzip）
    new CompressionPlugin({
      test: /.(js|css)$/, // 匹配 JavaScript 和 CSS 文件
      filename: '[path][base].gz', // 压缩后的文件名
      algorithm: 'gzip', // 使用 Gzip 算法
      threshold: 10240, // 只压缩大于 10KB 的文件
      minRatio: 0.8, // 压缩比达到 0.8 时才压缩
    }),
  ],
  optimization: {
    minimize: true, // 启用代码压缩
    runtimeChunk: {
      name: 'runtime', // 将运行时代码提取为单独的 chunk
    },
    minimizer: [
      // 压缩 JavaScript 代码
      new TerserWebpackPlugin({
        extractComments: false, // 不提取注释
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'], // 移除 console.log
          },
        },
      }),
      // 压缩 CSS 代码
      new CssMinimizerPlugin(),
    ].filter(Boolean), // 过滤掉 falsy 值（如 false 或 null）
    splitChunks: {
      chunks: 'async', // 只对异步加载的模块进行代码分割
      minChunks: 1, // 模块被引用至少 1 次时才分割
      minSize: 100000, // 模块大小至少为 100KB 时才分割
      maxAsyncRequests: 5, // 异步加载时最大并行请求数为 5
      maxInitialRequests: 3, // 初始加载时最大并行请求数为 3
      name: false, // 不指定 chunk 的名称
      cacheGroups: {
        // 将 node_modules 中的代码提取为单独的 chunk
        vendors: {
          test: /node_modules/, // 匹配 node_modules 中的模块
          name: 'vendors', // chunk 的名称为 vendors
          minChunks: 1, // 模块被引用至少 1 次时才提取
          chunks: 'initial', // 只对初始加载的模块进行提取
          minSize: 0, // 不限制模块大小
          priority: 1, // 优先级为 1
        },
        // 将公共代码提取为单独的 chunk
        commons: {
          name: 'commons', // chunk 的名称为 commons
          minChunks: 2, // 模块被引用至少 2 次时才提取
          chunks: 'initial', // 只对初始加载的模块进行提取
          minSize: 0, // 不限制模块大小
        },
      },
    },
  },
});
