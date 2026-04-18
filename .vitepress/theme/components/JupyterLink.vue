<template>
  <button
    @click="openNotebook"
    class="jupyter-btn"
    title="打开Jupyter笔记本"
    type="button"
  >
    打开当前页面的Jupyter笔记本
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const notebookUrl = computed(() => {
  const path = page.value.relativePath
  if (!path?.endsWith('.md')) {
    return null
  }

  const notebookPath = path
    .replace(/\.md$/, '.ipynb')
    .split('/')
    .map((segment) => encodeURIComponent(segment))
    .join('/')

  return `${import.meta.env.BASE_URL}jupyter/notebooks/?path=${notebookPath}`
})

const openNotebook = () => {
  if (!notebookUrl.value) {
    return
  }

  window.open(notebookUrl.value, '_blank')
}
</script>

<style>
.jupyter-btn {
  padding: 4px 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
}

.jupyter-btn:hover {
  opacity: 0.8;
}
</style>