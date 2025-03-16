const { resolve } = require('path');
const { PROJECT_PATH, IS_DEV } = require('./config'); // 引入项目配置文件中的常量
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 引入 MiniCssExtractPlugin 插件，用于将 CSS 提取为单独的文件
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入 HtmlWebpackPlugin 插件，用于生成 HTML 文件并自动注入打包后的资源
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 引入 CopyWebpackPlugin 插件，用于复制静态文件到输出目录
const webpack = require('webpack'); // 引入 webpack 核心模块，用于访问 webpack 的内置插件和功能
const WebpackBar = require('webpackbar'); // 引入 WebpackBar 插件，用于在终端显示美观的构建进度条
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'); // 引入 ForkTsCheckerWebpackPlugin 插件，用于在单独的进程中检查 TypeScript 类型

// 定义通用的 CSS 加载器配置
const commonCssLoader = [
  // 使用 MiniCssExtractPlugin 提取 CSS 文件
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      importLoaders: 1, // 指定在 css-loader 之前应用的 loader 数量
      modules: {
        // 配置 CSS 模块化，开发环境下显示路径和类名，生产环境下使用哈希
        localIdentName: IS_DEV ? '[path][name]__[local]' : '[hash:base64]',
      },
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      postcssOptions: {
        plugins: ['postcss-preset-env'], // 使用 postcss-preset-env 插件处理 CSS 兼容性
      },
    },
  },
];

module.exports = {
  // 入口文件，通常是项目的根文件
  entry: resolve(PROJECT_PATH, './src/index.tsx'),

  // 输出配置
  output: {
    filename: IS_DEV ? 'assets/js/[name].js' : 'assets/js/[name]-[chunkhash:8].js', // 开发环境下不哈希，生产环境下使用哈希
    path: resolve(PROJECT_PATH, './dist'), // 输出目录
  },

  // 缓存配置，使用文件系统缓存
  cache: { type: 'filesystem' },

  // 模块规则
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/, // 匹配 JavaScript 和 TypeScript 文件
        loader: 'babel-loader', // 使用 Babel 转译
        options: { cacheDirectory: true }, // 启用 Babel 缓存
        include: [resolve('src')], // 只处理 src 目录下的文件
        exclude: /node_modules/, // 排除 node_modules 目录
      },
      {
        test: /\.css$/, // 匹配 CSS 文件
        use: [...commonCssLoader], // 使用通用的 CSS 加载器配置
      },
      {
        test: /\.less$/, // 匹配 Less 文件
        use: [...commonCssLoader, 'less-loader'], // 在通用 CSS 加载器基础上添加 less-loader
      },
      {
        test: /\.(sa|sc)ss$/, // 匹配 Sass/SCSS 文件
        use: [...commonCssLoader, 'sass-loader'], // 在通用 CSS 加载器基础上添加 sass-loader
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/, // 匹配字体文件
        use: { loader: 'file-loader' }, // 使用 file-loader 处理
        generator: {
          filename: 'assets/font/[name]-[contenthash:8].[ext]', // 输出字体文件的路径和名称
        },
      },
      {
        test: /\.(png|jpe?g|gif)$/i, // 匹配图片文件
        use: [
          'file-loader', // 使用 file-loader 处理
          {
            loader: 'image-webpack-loader', // 使用 image-webpack-loader 优化图片
            options: {
              mozjpeg: {
                progressive: true, // 渐进式 JPEG
              },
              optipng: {
                enabled: false, // 禁用 optipng
              },
              pngquant: {
                quality: [0.65, 0.9], // PNG 质量
                speed: 4, // 压缩速度
              },
              gifsicle: {
                interlaced: false, // 不交错 GIF
              },
              webp: {
                quality: 75, // WebP 质量
              },
              disable: true,
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav)$/, // 匹配音视频文件
        use: [
          {
            loader: 'url-loader', // 使用 url-loader 处理
            options: {
              limit: 1024 * 10, // 文件小于 10KB 时转为 base64
              fallback: {
                loader: 'file-loader', // 超过限制时使用 file-loader
                options: {
                  name: 'assets/media/[name]-[contenthash:8].[ext]', // 输出音视频文件的路径和名称
                },
              },
            },
          },
        ],
      },
      {
        test: /\.html$/, // 匹配 HTML 文件
        loader: 'html-loader', // 使用 html-loader 处理
        include: [resolve('src')], // 只处理 src 目录下的文件
      },
    ],
  },

  // 插件配置
  plugins: [
    // 提取 CSS 文件
    new MiniCssExtractPlugin({
      filename: IS_DEV ? 'assets/styles/[name].css' : 'assets/styles/[name]-[contenthash:8].css', // 开发环境下不哈希，生产环境下使用哈希
      chunkFilename: IS_DEV ? 'assets/styles/[id].css' : 'assets/styles/[id]-[contenthash:8].css', // 同上
      ignoreOrder: true, // 忽略 CSS 顺序警告
    }),

    // 生成 HTML 文件
    new HtmlWebpackPlugin({
      title: 'react-admin-template', // HTML 标题
      filename: 'index.html', // 输出文件名
      template: resolve(PROJECT_PATH, './public/index.html'), // 模板文件路径
      cache: false, // 禁用缓存
      minify: IS_DEV
        ? false // 开发环境下不压缩
        : {
            minifyCSS: true, // 压缩 CSS
            minifyJS: true, // 压缩 JS
            minifyURLs: true, // 压缩 URL
            removeComments: true, // 移除注释
            removeAttributeQuotes: true, // 移除属性引号
            removeRedundantAttributes: true, // 移除冗余属性
            removeScriptTypeAttributes: true, // 移除 script 标签的 type 属性
            removeStyleLinkTypeAttributes: true, // 移除 style/link 标签的 type 属性
            collapseWhitespace: true, // 折叠空白
            collapseBooleanAttributes: true, // 折叠布尔属性
            collapseInlineTagWhitespace: true, // 折叠内联标签的空白
            useShortDoctype: true, // 使用短文档类型
          },
    }),

    // 复制静态文件
    new CopyWebpackPlugin({
      patterns: [
        {
          from: resolve(PROJECT_PATH, './public'), // 源目录
          to: 'public', // 目标目录
          force: true, // 强制覆盖
          noErrorOnMissing: true, // 忽略缺失文件
          globOptions: {
            dot: true, // 包含以点开头的文件
            gitignore: false, // 忽略 .gitignore
            ignore: ['**/index.html'], // 忽略 index.html 文件
          },
        },
      ],
    }),

    // 显示 Webpack 构建进度条
    new WebpackBar({
      color: 'orange', // 进度条颜色
      name: 'WORKING', // 进度条名称
    }),

    // 在单独的进程中检查 TypeScript 类型
    new ForkTsCheckerWebpackPlugin({
      typescript: {
        memoryLimit: 4096, // 内存限制
        configFile: resolve(PROJECT_PATH, './tsconfig.json'), // TypeScript 配置文件路径
        diagnosticOptions: {
          syntactic: false, // 不检查语法错误
          semantic: false, // 不检查语义错误
          declaration: false, // 不检查声明文件
          global: false, // 不检查全局错误
        },
      },
    }),

    // 定义全局变量
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        NODE_ENV: process.env.NODE_ENV, // 环境变量
        WEBPACK_DEV_SERVER: process.env.WEBPACK_DEV_SERVER, // Webpack 开发服务器
      }),
    }),
  ],

  // 解析配置
  resolve: {
    alias: {
      '@': resolve(PROJECT_PATH, './src'), // 路径别名
      '@assets': resolve(PROJECT_PATH, './src/assets'),
      '@components': resolve(PROJECT_PATH, './src/components'),
      '@pages': resolve(PROJECT_PATH, './src/pages'),
      '@routes': resolve(PROJECT_PATH, './src/routes'),
      '@models': resolve(PROJECT_PATH, './src/models'),
      '@styles': resolve(PROJECT_PATH, './src/styles'),
      '@utils': resolve(PROJECT_PATH, './src/utils'),
    },
    extensions: ['.js', '.ts', '.tsx', '.jsx', '.json'], // 自动解析的文件扩展名
    fallback: {
      path: require.resolve('path-browserify'), // 解决 path 模块在浏览器环境下的兼容性问题
    },
  },

  // 开发工具配置
  devtool: IS_DEV ? 'eval-cheap-module-source-map' : 'cheap-module-source-map', // 开发环境下使用更快的 source map，生产环境下使用更小的 source map
};
