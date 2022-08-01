<script setup>
import { useI18n } from "vue-i18n"
const { t } = useI18n()
console.log("i18n", t("message.hello"))
console.log("process.env.NODE_ENV", process.env.NODE_ENV)
</script>

<template>
  {{ $t("message.hello") }}
  <select v-model="$i18n.locale">
    <option v-for="locale in $i18n.availableLocales" :key="`locale-${locale}`" :value="locale">
      {{ locale }}
    </option>
  </select>
</template>
