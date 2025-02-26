import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const ClipboardWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.clipboard.list',
  title: { 'zh-CN': '剪切板', 'en-US': 'Clipboard' },
  description: { 'zh-CN': '带搜索、收藏功能的剪切板', 'en-US': 'Clipboard with search and collection functions' },
  keywords: [WidgetKeyword.RECOMMEND],
  categories: ['productivity'],
  lang: 'zh-CN',
  socialLinks: [{
    name: 'github',
    link: 'https://github.com/rtugeek/clipboard',
  }],
  browserWindowOptions: {
    backgroundThrottling: false,
  },
  previewImage: '/images/preview_clipboard.png',
  path: '/clipboard',
})

export default ClipboardWidget
