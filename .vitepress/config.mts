import { defineConfig } from 'vitepress'
import mdFootnote from "markdown-it-footnote";

const hostURL = 'https://certseeds.github.io/awesome-exams-page'

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "awesome-exams-page",
    description: "awesome sustech exams pages",
    srcExclude: [
        "README.md",
        "LICENSE_AGPL_V3_0.md",
        "LICENSE_CC_BY_NC_SA_V4_0.md"
    ],
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        nav: [
            { text: 'Home', link: '/' }
        ],
        sidebar: [
            {
                text: '科目',
                items: [
                    { text: "MA103_线性代数", link: '/MA103_线性代数/README' }
                    , { text: "MA103_线性代数", link: '/MA103_线性代数/README' }
                ]
            }
        ],
        socialLinks: [
            { icon: 'github', link: 'https://github.com/Certseeds/awesome-exams-page' }
        ],
        footer: {
            copyright: `2025-${new Date().getFullYear()} Certseeds; this page is licensed under CC BY-NC-SA 4.0; 本站非官方, 不盈利, 纯免费, 严禁商用`
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
    },
    head: [
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:locale', content: 'zh-CN' }],
        ['meta', { property: 'og:title', content: 'awesome-exams-page | Static Book Site Powered by VitePress' }],
        ['meta', { property: 'og:site_name', content: 'awesome-exams-page' }],
        ['meta', { property: 'og:image', content: `${hostURL}/favicon.ico` }],
        ['meta', { property: 'og:url', content: `${hostURL}` }],
        ['meta', { property: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { property: 'twitter:title', content: 'awesome-exams-page | Static Book Site Powered by VitePress' }],
        ['meta', { property: 'twitter:image', content: `${hostURL}/favicon.ico` }],
        ['meta', { property: 'twitter:description', content: 'awesome sustech exams page' }],
        ['meta', { property: 'keywords', content: 'vitepress, sustech, nodejs, mathpix, latex' }],
        ['meta', { property: 'robots', content: 'index, follow' }],
        ['meta', { property: 'author', content: 'Certseeds, NikeTacoHub' }],
        ['meta', { property: 'copyleft', content: 'CC BY-NC-SA 4.0' }],
        ['link', { property: 'license', href: "http://creativecommons.org/licenses/by-nc-sa/4.0/" }],

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
    metaChunk: true
})
