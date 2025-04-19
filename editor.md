---
title: Markdown 编辑器
aside: false
---

<script setup>
import { ref } from 'vue'
import VditorEditor from './.vitepress/components/VditorEditor.vue'

const markdownContent = ref([
    '# 开始编辑你的 Markdown',
    '',
    '欢迎使用 Vditor 编辑器！',
    '',
    '## 数学公式支持',
    '',
    '行内公式: $E = mc^2$',
    '',
    '行间公式:',
    '',
    '$$\\begin{bmatrix}',
    'a & b \\\\',
    'c & d',
    '\\end{bmatrix}$$',
    '',
    '## 代码块',
    '',
    '```js',
    'function hello() {',
    '  console.log("Hello, Vditor!");',
    '}',
    '```'
].join('\n'))

const handleSave = (content) => {
  console.log('保存内容:', content)
  // 这里可以实现保存逻辑，比如通过API保存到服务器
}
</script>

# Markdown 编辑器

使用 Vditor 可视化 Markdown 编辑器，支持实时预览和各种扩展功能, 主要是为了能让用户不需要下载库, 执行pnpm build就可以编辑文档, 比对效果.

PS: 编辑器需要一小段时间加载`https://unpkg.com/`上的资源

<VditorEditor
  v-model:value="markdownContent"
  :height="600"
  @save="handleSave"
/>

<div class="action-buttons">
  <button class="save-button" @click="$refs.editor?.save()">保存内容</button>
</div>

<style>
.action-buttons {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  background-color: var(--vp-c-brand);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.save-button:hover {
  background-color: var(--vp-c-brand-dark);
}
</style>
