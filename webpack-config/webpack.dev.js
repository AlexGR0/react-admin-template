const { PORT, HOST, PROJECT_PATH } = require("./config");
const webpackCommon = require("./webpack.common");
const { resolve } = require("path");
const { merge } = require("webpack-merge");

module.exports = merge(webpackCommon, {
  mode: "development",
  devServer: {
    // https: true,
    client: {
      overlay: true,
    },
    host: HOST,
    port: PORT,
    open: false,
    hot: true,
    compress: true,
    // historyApiFallback: true,
    client: {
      logging: "error",
      overlay: {
        errors: true,
        warnings: false,
      },
    },
    static: resolve(PROJECT_PATH, "./public"),
    // proxy: {
    //   "/api/**": {
    //     target: "https://...",
    //     pathRewrite: { "^/api": "" },
    //     changeOrigin: true,
    //   },
    // },
  },
});
