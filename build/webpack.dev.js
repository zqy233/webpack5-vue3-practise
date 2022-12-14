const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const FriendlyErrorsPlugin = require("@soda/friendly-errors-webpack-plugin")

const port = "8082"
module.exports = () => {
  let dev_config = {
    devtool: "inline-source-map", //开启source map
    mode: "development",
    // 缓存，优化速率
    cache: {
      type: "filesystem"
    },
    module: {
      rules: [
        {
          //解析器的执行顺序是从下往上(先css-loader再style-loader)
          test: /\.css$/i,
          use: ["style-loader", "css-loader"]
        },
        {
          // i：表示不区分大小写（case-insensitive）模式，即在确定匹配项时忽略模式与字符串的大小写；
          test: /\.s[ac]ss$/i,
          use: [
            // 将 JS 字符串生成为 style 节点
            "style-loader",
            // 将 CSS 转化成 CommonJS 模块
            "css-loader",
            // 将 Sass 编译成 CSS
            "sass-loader"
          ]
        },
        {
          test: /\.less$/i,
          use: [
            // compiles Less to CSS
            "style-loader",
            "css-loader",
            "less-loader"
          ]
        }
      ]
    },
    plugins: [
      //运行成功，输出信息
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`You application is running here http://127.0.0.1:${port} \r\nYou can also open local address http://localhost:${port}`],
          clearConsole: true
        }
      })
    ],
    devServer: {
      host: "127.0.0.1",
      port,
      open: true // 启动服务器后自动打开网页
      // 设置前端代理
      // proxy: {
      //   "/api": {
      //     target: "http://www.xxx.com:8080/api",
      //     secure: true, // 如果是https接口，需要配置这个参数
      //     changeOrigin: true,
      //     pathRewrite: { "^/finchinaAPP": "" }
      //   }
      // }
    }
  }

  return merge(common(), dev_config)
}
