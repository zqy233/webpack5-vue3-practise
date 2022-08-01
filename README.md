# 指南

## 起步-搭建项目

### 初始化package.json

```sh
npm init -y
```

### 下载webpack相关依赖

```sh
npm i webpack webpack-cli webpack-merge -D
```

| 依赖包        | 作用                                          |
| ------------- | --------------------------------------------- |
| webpack       | 核心库                                        |
| webpack-cli   | 命令行中调用webpack                           |
| webpack-merge | 合并webpack配置文件，用于开发生产使用不同配置 |

### 新建`build`文件夹

文件夹下创建`webpack.common.js`、`webpack.dev.js`、`webpack.prod.js`三个文件

## 安装vue相关依赖

```sh
npm i -s vue@next vue-loader@next @vue/compiler-sfc
```

> 模仿vue脚手架创建模板

### 创建main.js

```js
import { createApp } from "vue"
import App from "./App.vue"

createApp(App).mount("#app")
```

### App.vue

```vue
<template>
  <HelloWorld msg="Welcome to Your Vue.js App" />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue"

export default {
  name: "App",
  components: {
    HelloWorld
  }
}
</script>
```

### components/HelloWorld.vue

```vue
<template>
  {{ num }}
  <button @click="add">点击增加</button>
</template>

<script setup>
import { ref } from "vue"
const num = ref(0)
const add = () => {
  num.value++
}
</script>
<style lang="scss" scoped>
button {
  border: none;
  background-color: skyblue;
  padding: 10px;
  border-radius: 5px;
  cursor: pointer;
  color: #fff;
}
</style>
```

## 启动服务器，运行html

```sh
npm i webpack-dev-serve html-webpack-plugin -D
```

webpack-dev-server  提供一个本地server服务器

html-webpack-plugin 指定使用的html模板

### 创建public/html文件

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <script src="./config.js"></script>
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <noscript>
      <strong>We're sorry but <%= htmlWebpackPlugin.options.title %> doesn't work properly without JavaScript enabled. Please enable it to continue.</strong>
    </noscript>
    <div id="app"></div>
    <!-- built files will be auto injected -->
  </body>
</html>
```

## babel

```sh
npm i -D babel-loader @babel/core @babel/preset-env
```

```js
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
```

## 处理css

```sh
npm i -D style-loader css-loader
```

```js
{
          //解析器的执行顺序是从下往上(先css-loader再style-loader)
          test: /\.css$/i,
          use: [
            "style-loader",
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
        }
```

## 复制静态文件

复制不参与打包的静态文件至打包后的文件夹中

```js
const CopyWebpackPlugin = require("copy-webpack-plugin")
```

```js
new CopyWebpackPlugin({
  patterns: [{ from: "public/config.js", to: "config.js" }]
})
```

## 控制台显示信息

原始版本的`friendly-errors-webpack-plugin`已经长时间不更新了，webpack5中虽然能正常使用，但是使用npm下载依赖时会报错（yarn中不会报错），报错提示webpack版本不兼容，所以使用fork版本的`friendly-errors-webpack-plugin`

```sh
npm i -D @soda/friendly-errors-webpack-plugin
```

```js
   plugins: [
      //运行成功，输出信息
      new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`You application is running here http://127.0.0.1:${port} \r\nYou can also open local address http://localhost:${port}`],
          clearConsole: true
        }
      })
    ],
```



## 使用i18n

```sh
npm i vue-i18n@next
```

### main.js使用

```js
import { createApp } from "vue"
import App from "./App.vue"
import { createI18n } from "vue-i18n"

const messages = {
  zh: {
    message: {
      hello: "你好世界"
    }
  },
  en: {
    message: {
      hello: "hello world"
    }
  }
}
const i18n = createI18n({
  legacy: false,
  locale: "zh",
  messages
})
const app = createApp(App)
app.use(i18n)
app.mount("#app")
```

### vue中使用

```vue
<script setup>
import { useI18n } from "vue-i18n"
const { t } = useI18n()
console.log("i18n", t("message.hello"))
</script>

<template>
  {{ $t("message.hello") }}
  <select v-model="$i18n.locale">
    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
      {{ locale }}
    </option>
  </select>
</template>
```

### 解决控制台警告

解决控制台警告  vue-i18n.esm-bundler.js:39 You are running the esm-bundler build of vue-i18n

```js
 alias: {
        "@": join("../src"), // @方式引入资源
        // 添加下方代码
        "vue-i18n": "vue-i18n/dist/vue-i18n.cjs.js"
      }
```

## 完整配置

## 鸣谢

本项目深受以下文章的影响

- https://juejin.cn/post/7034810358795599880#comment
- https://juejin.cn/post/7029609093539037197#comment
- https://blog.csdn.net/BY_BC/article/details/125387921