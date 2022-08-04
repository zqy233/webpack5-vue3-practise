<template>
  <HelloWorld />
  <aa />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue"
import aa from "./components/a.vue"
export default {
  name: "App",
  components: {
    HelloWorld,
    aa
  }
}
</script>
