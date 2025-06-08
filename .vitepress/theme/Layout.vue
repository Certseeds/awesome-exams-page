<template>
  <Layout>
    <template #doc-after>
      <div class="pdf-footer">
        <hr>
        <PdfDownload />
      </div>
    </template>
  </Layout>
</template>

<script setup>
import DefaultTheme from 'vitepress/theme'
import PdfDownload from './components/PdfDownload.vue'

const { Layout } = DefaultTheme
</script>

<style>
.pdf-footer {
  margin: 2rem 0;
  text-align: center;
}
.pdf-footer hr {
  margin: 1rem 0;
}
</style>
