const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin
// webpack 通过 manifest，可以追踪所有模块到输出 bundle 之间的映射
const { WebpackManifestPlugin } = require("webpack-manifest-plugin")

const webpackConfig = env => {
  let pro_config = {
    target: "web",
    mode: "production",
    // devtool:'source-map', // 开启将会生成map文件
    plugins: [
      new WebpackManifestPlugin(),
      // 定义全局环境变量
      // new webpack.DefinePlugin({
      //   "process.env.NODE_ENV": JSON.stringify("production")
      // }),
      //提取CSS
      new MiniCssExtractPlugin({
        filename: `assets/css/[name].style.css`,
        chunkFilename: `assets/css/[name].css`
      })
      // 复制不参与打包的静态文件至打包后的文件
      // new CopyWebpackPlugin({
      //   patterns: [{ from: "public/config.js", to: "config.js" }]
      // })
    ],
    module: {
      rules: [
        {
          //解析器的执行顺序是从下往上(先css-loader再style-loader)
          test: /\.css$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: "css-loader",
              options: {
                esModule: false,
                modules: {
                  auto: false, //modules 开关,移动端多页面模式关闭class hash命名
                  localIdentName: "[local]_[hash:base64:8]" // 自定义生成的类名
                }
              }
            }
          ]
        },
        {
          test: /\.scss$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
        },
        {
          test: /\.less$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "less-loader"]
        }
      ]
    },
    // webpack优化配置
    optimization: {
      // webpack设置打包模块id时使用的算法
      chunkIds: "named",
      minimizer: [
        new CssMinimizerPlugin() // 压缩css
      ],
      splitChunks: {
        chunks: "all",
        maxSize: 30000,
        minChunks: 2 // 引入次数，如果为2 那么一个资源最少被引用两次才可以被拆分出来
        // cacheGroups: {
        //   vendor: {
        //     name: "vendor",
        //     test: /[\\/]node_modules[\\/]/,
        //     chunks: "all",
        //     priority: 2 //2>0  node_modules里的模块将优先打包进vendor
        //   },
        //   commons: {
        //     name: "commons",
        //     chunks: "all", // async异步代码分割 initial同步代码分割 all同步异步分割都开启
        //     minSize: 20000, // 引入的文件大于30kb才进行分割
        //     priority: 0 //优先级，先打包到哪个组里面，值越大，优先级越高
        //   }
        // }
      }
    }
  }
  if (process.env.NODE_ANALYZER) {
    pro_config.plugins.push(new BundleAnalyzerPlugin()) // 打包体积分析
    // pro_config.plugins.push(new ManifestPlugin()) // 展示源代码和打包代码映射关系
  }
  return merge(common(env), pro_config) //合并配置
}
module.exports = webpackConfig

// 手动调动webpack，从而监听配置的变化进行打包
webpack(webpackConfig(), (err, stats) => {
  // spinner.stop()
  if (err) throw err
  // console.log底层就是通过process.stdout.write实现了
  process.stdout.write(
    // 设置webpack在命令行中输出的内容（定制化地输出内容）
    // https://www.webpackjs.com/configuration/stats/
    stats.toString({
      // 添加构建日期和构建时间信息
      // builtAt: true,
      // 控制台添加颜色
      colors: true
      // modules: false,
      // children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
      // chunks: false,
      // chunkModules: false
    }) + "\n\n"
  )
  if (stats.hasErrors()) {
    console.log("Build failed with errors.\n")
    process.exit(1)
  }
  // console.log(chalk.cyan("  Build complete.\n"))
  // console.log(chalk.yellow("  Tip: built files are meant to be served over an HTTP server.\n" + "  Opening index.html over file:// won't work.\n"))
})
