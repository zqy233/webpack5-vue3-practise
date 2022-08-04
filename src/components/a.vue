<template>
  <div class="sticky">
    <h1>滚动显示文字</h1>
  </div>
</template>

<script setup>
import { onMounted } from "vue"
onMounted(() => {
  const h1 = document.querySelector("h1")
  window.onscroll = () => {
    let scrolled = document.documentElement.scrollTop / (document.documentElement.scrollHeight - document.documentElement.clientHeight)
    h1.style.setProperty("--percentage", `${scrolled * 100}%`)
  }
})
</script>

<style lang="scss">
:root {
  --percentage: 0%;
}
#app {
  margin: 0;
  background-color: #000;
  height: 300vh;
}
.sticky {
  position: sticky;
  top: 0;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
h1 {
  font-family: serif;
  margin: 0;
  padding: 0;
  font-size: 40px;
  color: #fff;
  letter-spacing: -0.3px;
  background-image: linear-gradient(75deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 33.3%, rgba(255, 255, 255, 0) 66.67%, rgba(255, 255, 255, 0) 100%);
  background-size: 300% 100%;
  background-position-x: calc(100% - var(--percentage));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
}
</style>
