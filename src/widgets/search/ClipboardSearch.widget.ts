import { BackgroundWidget, WidgetKeyword } from '@widget-js/core'

const ClipboardSearchWidget = new BackgroundWidget({
  path: '/search',
  configPagePath: '/search/config',
  name: 'cn.widgetjs.widgets.clipboard.search',
  title: { 'zh-CN': '剪切板搜索' },
  description: { 'zh-CN': '在屏幕上方显示剪切板快捷搜索' },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: 'zh-CN',
  categories: ['productivity'],
  permissions: ['clipboard'],
  previewImage: '/images/preview_search.png',
})

export default ClipboardSearchWidget
