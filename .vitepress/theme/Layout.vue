<template>
  <Layout>
    <template #doc-after>
      <div class="doc-actions-footer">
        <hr>
        <div class="doc-actions">
          <PdfDownload />
          <JupyterLink v-if="showJupyter" />
        </div>
      </div>
    </template>
  </Layout>
</template>

<script setup>
import { computed } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PdfDownload from './components/PdfDownload.vue'
import JupyterLink from './components/JupyterLink.vue'

const { Layout } = DefaultTheme
const { page, frontmatter } = useData()

const showJupyter = computed(() => frontmatter.value?.['has-jupyter'] === true)
</script>

<style>
.doc-actions-footer {
  margin: 2rem 0;
  text-align: center;
}

.doc-actions-footer hr {
  margin: 1rem 0;
}

.doc-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
}
</style>
