const path = require("path")
const { VueLoaderPlugin } = require("vue-loader")
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { join } = require("path")
const webpack = require("webpack")
module.exports = env => {
  return {
    entry: "./src/main.js", // 入口文件
    stats: "errors-only", // 仅错误时显示logo
    output: {
      filename: "assets/js/[name].code.js",
      chunkFilename: "assets/js/[name].bundle.js", // 动态导入 分离bundle 比如lodashjs配合注释import(/* webpackChunkName: "lodash" */ 'lodash') 会打包成lodash.bundle.js
      path: path.resolve(__dirname, "../dist")
    },
    plugins: [
      new VueLoaderPlugin(),
      // vue3 浏览器控制台会输出warning，提示：ReferenceError: __VUE_OPTIONS_API__, __VUE_PROD_DEVTOOLS__ is not defined
      // __VUE_OPTIONS_API__表示是否支持 options api 的写法，默认是 true，如果只用composition写法，可以设置为false来优化打包
      // __VUE_PROD_DEVTOOLS__：表示生产包是否要继续支持 devtools 插件，默认是 false
      new webpack.DefinePlugin({
        __VUE_OPTIONS_API__: true,
        __VUE_PROD_DEVTOOLS__: false
      }),
      new HtmlWebpackPlugin({
        template: path.join(__dirname, "../public/index.html"),
        title: "webpack5+vue3",
        filename: "index.html" //输出的文件名
      })
      // new i18nPlugin(i18nConfig)
    ],
    resolve: {
      //配置模块如会解析
      extensions: [".vue", ".js", ".json"], //引入这些文件 可以不带后缀 按顺序解析
      alias: {
        "@": join("../src"), //@方式引入资源
        // 解决警告:vue-i18n.esm-bundler.js:39 You are running the esm-bundler build of vue-i18n
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
    },
    module: {
      rules: [
        {
          test: /\.vue$/,
          loader: "vue-loader"
        }, // 它会应用到普通的 `.js` 文件以及 `.vue` 文件中的 `<script>` 块
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"]
            }
          }
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          type: "asset",
          parser: {
            dataUrlCondition: {
              maxSize: 6 * 1024 //小于6kb的图片内联处理
            }
          }
        }
      ]
    }
  }
}
