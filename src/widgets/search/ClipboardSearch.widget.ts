import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const ClipboardSearchWidget = new BackgroundWidget({
  path: '/search',
  configPagePath: '/search/config?transparent=false&frame=true&width=550&height=400',
  name: 'cn.widgetjs.widgets.clipboard.search',
  title: {
    'zh-CN': '剪切板搜索',
    'en-US': 'Clipboard Search',
  },
  description: {
    'zh-CN': '在屏幕上方显示剪切板快捷搜索',
    'en-US': 'Search clipboard text with shortcut',
  },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: 'zh-CN',
  socialLinks: [{
    name: 'github',
    link: 'https://github.com/rtugeek/clipboard',
  }],
  categories: ['productivity'],
  permissions: ['clipboard'],
  previewImage: '/images/preview_search.png',
})

export default ClipboardSearchWidget
