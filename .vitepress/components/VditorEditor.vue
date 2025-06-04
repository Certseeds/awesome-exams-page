<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import 'vditor/dist/index.css'

const props = defineProps({
  value: {
    type: String,
    default: ''
  },
  height: {
    type: Number,
    default: 400
  },
  width: {
    type: String,
    default: '100%'
  },
  options: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:value', 'save'])

const vditor = ref(null)
const vditorRef = ref(null)
const content = ref(props.value)

// 监听内容变化同步到父组件
watch(
  () => content.value,
  (val) => {
    emit('update:value', val)
  }
)

// 监听props变化同步到编辑器
watch(
  () => props.value,
  (val) => {
    if (vditor.value && val !== vditor.value.getValue()) {
      vditor.value.setValue(val)
    }
  }
)

onMounted(async () => {
  // 动态导入Vditor, 避免SSR问题
  const Vditor = (await import('vditor')).default

  // 默认配置
  const defaultOptions = {
    height: props.height,
    width: props.width,
    mode: 'wysiwyg',
    theme: 'classic',
    cache: {
      enable: false
    },
    toolbar: [
      'headings', 'bold', 'italic', 'strike', 'link', '|',
      'list', 'ordered-list', 'check', 'outdent', 'indent', '|',
      'quote', 'line', 'code', 'inline-code', '|',
      'upload', 'table', '|',
      'undo', 'redo', '|',
      'fullscreen', 'edit-mode', 'both', 'preview'
    ],
    preview: {
      math: {
        inlineDigit: true,
        engine: 'MathJax'
      }
    },
    after: () => {
      vditor.value.setValue(content.value)
      vditor.value.focus()
    },
    input: (val) => {
      content.value = val
    }
  }

  // 合并配置
  const options = {
    ...defaultOptions,
    ...props.options
  }

  // 初始化编辑器
  vditor.value = new Vditor(vditorRef.value, options)
})

onUnmounted(() => {
  // 销毁编辑器
  if (vditor.value) {
    vditor.value.destroy()
  }
})

// 提供保存方法给父组件调用
const save = () => {
  if (vditor.value) {
    const value = vditor.value.getValue()
    emit('save', value)
    return value
  }
  return content.value
}

// 暴露方法给父组件
defineExpose({
  save,
  getVditor: () => vditor.value
})
</script>

<template>
  <div class="vditor-container">
    <div ref="vditorRef" class="vditor-editor" />
  </div>
</template>

<style scoped>
.vditor-container {
  width: 100%;
  margin: 0 auto;
}
</style>