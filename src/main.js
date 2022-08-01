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
