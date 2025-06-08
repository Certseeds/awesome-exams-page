<template>
  <button 
    v-if="showButton" 
    @click="downloadPdf" 
    class="pdf-btn"
    title="下载PDF"
  >
    下载当前页面的PDF
  </button>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'

const { page } = useData()

const showButton = computed(() => {
  const path = page.value.relativePath
  return path?.includes('MA') && !path.includes('README')
})

const downloadPdf = () => {
  window.open(location.href.replace('.html', '.pdf'), '_blank')
}
</script>

<style>
.pdf-btn {
  padding: 4px 12px;
  background: var(--vp-c-brand);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 13px;
  margin-left: 8px;
}
.pdf-btn:hover {
  opacity: 0.8;
}
</style>
