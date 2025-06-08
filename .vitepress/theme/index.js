import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import PdfDownload from './components/PdfDownload.vue'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  enhanceApp({ app }) {
    // 全局注册PDF下载组件
    app.component('PdfDownload', PdfDownload)
  }
}
