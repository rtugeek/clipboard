import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const ClipboardSearchWidget = new BackgroundWidget({
  path: '/search',
  configPagePath: '/search/config?transparent=false&frame=true&width=550&height=600',
  name: 'cn.widgetjs.widgets.clipboard.search',
  title: {
    'zh-CN': 'AI剪切板',
    'en-US': 'Clipboard Search',
  },
  description: {
    'zh-CN': '使用剪切板内容对AI进行快速对话',
    'en-US': 'Quickly chat with AI using clipboard content',
  },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: 'zh-CN',
  browserWindowOptions: {
    backgroundThrottling: false,
  },
  socialLinks: [{
    name: 'github',
    link: 'https://github.com/rtugeek/clipboard',
  }],
  categories: ['productivity'],
  permissions: ['clipboard'],
  previewImage: '/images/preview_search.png',
})

export default ClipboardSearchWidget
