const webpack = require("webpack")
const { merge } = require("webpack-merge")
const common = require("./webpack.common.js")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin

module.exports = env => {
  let pro_config = {
    target: "web",
    mode: "production",
    // devtool:'source-map', // 开启将会生成map文件
    plugins: [
      // 定义全局环境变量
      // new webpack.DefinePlugin({
      //   "process.env.NODE_ENV": JSON.stringify("production")
      // }),
      //提取CSS
      new MiniCssExtractPlugin({
        filename: `assets/css/[name].style.css`,
        chunkFilename: `assets/css/[name].css`
      }),
      // 复制不参与打包的静态文件至打包后的文件
      new CopyWebpackPlugin({
        patterns: [{ from: "public/config.js", to: "config.js" }]
      })
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
    // webpack会根据该设置来进行代码拆分
    optimization: {
      minimizer: [
        new CssMinimizerPlugin() // 压缩css
      ],
      splitChunks: {
        minChunks: 2, // 模块至少使用次数
        cacheGroups: {
          vendor: {
            name: "vendor",
            test: /[\\/]node_modules[\\/]/,
            chunks: "all",
            priority: 2 //2>0  nodulesmodules里的模块将优先打包进vendor
          },
          commons: {
            name: "commons",
            chunks: "all", // async异步代码分割 initial同步代码分割 all同步异步分割都开启
            minSize: 30000, // 引入的文件大于30kb才进行分割
            priority: 0 //优先级，先打包到哪个组里面，值越大，优先级越高
          }
        }
      }
    }
  }
  if (process.env.NODE_ANALYZER) {
    pro_config.plugins.push(new BundleAnalyzerPlugin()) // 打包体积分析
    // pro_config.plugins.push(new ManifestPlugin()) // 展示源代码和打包代码映射关系
  }
  return merge(common(env), pro_config) //合并配置
}
