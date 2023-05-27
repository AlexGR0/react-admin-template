const { resolve } = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const commonCssLoader = [
  MiniCssExtractPlugin.loader,
  {
    loader: "css-loader",
    options: {
      importLoaders: 1,
    },
  },
  {
    loader: "postcss-loader",
    options: {
      postcssOptions: {
        plugins: ["postcss-preset-env"],
      },
    },
  },
];

module.exports = {
  mode: "development",
  entry: resolve("./src/index.ts"),
  output: {
    filename: "[name].js",
    path: resolve(__dirname, "../dist"),
  },
  module: {
    rules: [
      {
        test: /\.(js|ts|jsx|tsx)$/,
        include: [resolve("src")],
        exclude: /node_modules/,
        loader: "babel-loader",
      },
      {
        test: /\.css$/,
        use: [...commonCssLoader],
      },
      {
        test: /\.less$/,
        use: [...commonCssLoader, "less-loader"],
      },
      {
        test: /\.(sa|sc)ss$/,
        use: [...commonCssLoader, "sass-loader"],
      },
      {
        test: /\.(eot|woff|woff2|svg|ttf)([?]?.*)$/,
        use: { loader: "file-loader" },
        generator: {
          filename: "assets/font/[name]-[contenthash:8].[ext]",
        },
      },
      {
        test: /\.(jpg|png|jpeg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "assets/images/[name]-[contenthash:8].[ext]",
                },
              },
            },
          },
        ],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 1024,
              fallback: {
                loader: "file-loader",
                options: {
                  name: "assets/media/[name]-[contenthash:8].[ext]",
                },
              },
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "assets/styles/[name]-[contenthash:8].css",
    }),
  ],
};
