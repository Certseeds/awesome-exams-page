---
title: Jupyter 编辑器
aside: false
---

<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  window.location.replace(
    `${import.meta.env.BASE_URL}jupyter/notebooks/?path=editor.ipynb`,
  )
})
</script>

正在跳转到 Jupyter 编辑器...
