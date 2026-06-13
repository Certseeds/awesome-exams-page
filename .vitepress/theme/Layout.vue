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

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useData } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import PdfDownload from './components/PdfDownload.vue'
import JupyterLink from './components/JupyterLink.vue'

const { Layout } = DefaultTheme
const { page, frontmatter } = useData()

const showJupyter = computed(() => frontmatter.value?.['has-jupyter'] === true)

// ── copy handler: Deep-clone fragment, swap .katex → $LaTeX$, then serialize ──
function handleCopy(event: ClipboardEvent) {
  const sel = window.getSelection()
  if (!sel || sel.isCollapsed || !event.clipboardData) return

  const range = sel.getRangeAt(0)
  const fragment = range.cloneContents()
  if (!fragment.querySelector('.katex-mathml')) return

  // HTML: use original fragment
  const div = document.createElement('div')
  div.appendChild(fragment.cloneNode(true))
  event.clipboardData.setData('text/html', div.innerHTML)

  // Plain text: clone, swap each .katex with its LaTeX source, then serialize.
  // Serialize = join root-level children's textContent with \n
  const tf = fragment.cloneNode(true) as DocumentFragment
  for (const katexEl of tf.querySelectorAll('.katex')) {
    const tex = katexEl
      .querySelector('.katex-mathml annotation[encoding="application/x-tex"]')
      ?.textContent
    if (!tex) continue
    const isDisplay = katexEl.parentElement?.classList.contains('katex-display') ?? false
    const delim = isDisplay ? '$$' : '$'
    katexEl.replaceWith(document.createTextNode(delim + tex + delim))
  }

  // Join root-level children — browser's cloneContents gives us block elements
  // (h1-h6, p, li, etc.) as direct children, so joining with \n is enough.
  const lines: string[] = []
  for (const child of tf.childNodes) {
    const t = child.textContent?.trim()
    if (t) lines.push(t)
  }
  event.clipboardData.setData('text/plain', lines.join('\n'))
  event.preventDefault()
}

let boundHandler: ((e: Event) => void) | null = null

onMounted(() => {
  boundHandler = handleCopy as (e: Event) => void
  document.addEventListener('copy', boundHandler)
})

onUnmounted(() => {
  if (boundHandler) document.removeEventListener('copy', boundHandler)
})
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
