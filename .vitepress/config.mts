import { defineConfig } from 'vitepress'
import mdFootnote from "markdown-it-footnote";

const repoName = 'awesome-exams-page';
const hostURL = `https://certseeds.github.io/${repoName}/`

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "awesome-exams-page",
    description: "awesome sustech exams pages",
    srcExclude: ['jupyter/**'],
    base: `/${repoName}/`,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' },
            { text: '编辑器', link: '/editor' },
        ],
        sidebar: [
            {
                text: '科目',
                items: [
                    { text: "CS203-数据结构与算法分析", link: '/CS203-数据结构与算法分析/README' }
                    , { text: "MA101a-数学分析I", link: '/MA101a-数学分析I/README' }
                    , { text: "MA102a-数学分析II", link: '/MA102a-数学分析II/README' }
                    , { text: "MA103-线性代数", link: '/MA103-线性代数/README' }
                    , { text: "MA107-高等代数I", link: '/MA107-高等代数I/README' }
                    , { text: "MA111-高等代数II", link: '/MA111-高等代数II/README' }
                    , { text: "MA117-高等数学I", link: '/MA117-高等数学I/README' }
                    , { text: "MA127-高等数学II", link: '/MA127-高等数学II/README' }
                    , { text: "MA203a-数学分析III", link: '/MA203a-数学分析III/README' }
                    , { text: "MA212-概率论与数理统计", link: '/MA212-概率论与数理统计/README' }
                    , { text: "MA213-16-数学分析精讲", link: '/MA213-16-数学分析精讲/README' }
                ]
            }
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/Certseeds/awesome-exams-page' }
        ],
        footer: {
            copyright: `2025-${new Date().getFullYear()} Certseeds; this page is licensed under CC BY-NC-SA 4.0; 本站不盈利, 纯免费, 严禁商用`
        },
        lastUpdated: {
            formatOptions: {
                era: "short",
                year: "numeric",
                month: "long",
                weekday: "long",
                day: "numeric",
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
                timeZone: "UTC",
                timeZoneName: "longGeneric",
                fractionalSecondDigits: 3,
                formatMatcher: "basic",
            },
        },
        editLink: {
            pattern: 'https://github.com/Certseeds/awesome-exams-page/blob/master/:path?plain=1',
            text: '在GitHub上查看本页面源代码'
        }
    },
    head: [
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'zh-CN' }],
        ['meta', { property: 'og:title', content: 'awesome-exams-page | Awesome Sustech Exams Page Powered by VitePress' }],
        ['meta', { property: 'og:site_name', content: 'awesome-exams-page' }],
        ['meta', { property: 'og:image', content: `${hostURL}/favicon.ico` }],
        ['meta', { property: 'og:url', content: `${hostURL}` }],
        ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { property: 'twitter:title', content: 'awesome-exams-page |  Awesome Sustech Exams Page Powered by VitePress' }],
        ['meta', { property: 'twitter:image', content: `${hostURL}/favicon.ico` }],
        ['meta', { property: 'twitter:description', content: 'awesome sustech exams page' }],
        ['meta', { property: 'keywords', content: 'vitepress, sustech, nodejs, mathpix, latex' }],
        ['meta', { property: 'robots', content: 'index, follow' }],
        ['meta', { property: 'author', content: 'Certseeds, NikeTacoHub' }],
        ['meta', { property: 'copyleft', content: 'CC-BY-NC-SA-4.0' }],
        ['meta', { name: 'license', content: 'CC-BY-NC-SA-4.0' }],
        ['link', { rel: 'license', href: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' }],
        ['meta', { name: 'google-site-verification', content: 'RUZjTQhfsgxj0JmyySNM82pLKT-9thJwEbNZz372ee4' }]
    ],
    markdown: {
        config: (md) => {
            md.use(mdFootnote)
        },
        math: true
    },
    sitemap: {
        hostname: hostURL
    },
    lastUpdated: true,
    metaChunk: true,
    vite: {
        ssr: {
            // 避免在SSR期间尝试导入Vditor
            noExternal: ['vditor']
        },
        // 避免CSS代码分割, 确保Vditor样式可用
        build: {
            cssCodeSplit: false
        }
    }
})
