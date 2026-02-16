import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Compotes',
  description: 'Components library focused on accessibility/customization',
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🍯</text></svg>' }],
  ],
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Demo', link: '/demo/' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: [
            { text: 'Get started', link: '/guide/' },
            {
              text: 'Collapse / Accordion',
              link: '/guide/collapse',
            },
            {
              text: 'Drag',
              link: '/guide/drag',
            },
            {
              text: 'Drilldown',
              link: '/guide/drilldown',
            },
            {
              text: 'Dropdown',
              link: '/guide/dropdown',
            },
            {
              text: 'Marquee',
              link: '/guide/marquee',
            },
          ],
        },
        {
          text: 'Vue',
          items: [
            {
              text: 'Get started',
              link: '/guide/vue/',
            },
            {
              text: 'Composables',
              link: '/guide/vue/composables',
            },
            {
              text: 'Components',
              link: '/guide/vue/components',
            },
          ],
        },
      ],
      '/demo/': [
        {
          text: 'Demo',
          link: '/demo/',
          items: [
            { text: 'Collapse/Accordion', link: '/demo/collapse' },
            { text: 'Drag', link: '/demo/drag' },
            { text: 'Drilldown', link: '/demo/drilldown' },
            { text: 'Dropdown', link: '/demo/dropdown' },
            { text: 'Marquee', link: '/demo/marquee' },
          ],
        },
      ],
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Applelo/compotes' },
    ],
  },
})
