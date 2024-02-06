import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'Compotes',
  description: 'Components library focused on accessibility/customization',
  themeConfig: {
    footer: {
      message: 'Released under the MIT License.',
    },
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      { text: 'Demo', link: '/demo/collapse' },
    ],
    search: {
      provider: 'local',
    },
    sidebar: [
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
        text: 'Demo',
        collapsed: true,
        items: [
          { text: 'Collapse/Accordion', link: '/demo/collapse' },
          { text: 'Drag', link: '/demo/drag' },
          { text: 'Drilldown', link: '/demo/drilldown' },
          { text: 'Dropdown', link: '/demo/dropdown' },
          { text: 'Marquee', link: '/demo/marquee' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Applelo/compotes' },
    ],
  },
})
