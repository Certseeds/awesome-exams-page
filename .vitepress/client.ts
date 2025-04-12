// .vitepress/client.ts
import { defineClientComponent } from 'vitepress/client'
import { type Theme, inBrowser } from 'vitepress'

export default {
  // 确保只在浏览器环境中加载 Vditor
  enhanceApp({ app }) {
    if (inBrowser) {
      // 注册 Vditor 编辑器组件为客户端组件
      app.component('VditorEditor', defineClientComponent(() => {
        return import('./components/VditorEditor.vue')
      }))
      
    }
  }
} satisfies Theme