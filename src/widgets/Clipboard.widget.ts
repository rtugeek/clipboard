import {
  BackgroundWidget,
  WidgetKeyword,
} from '@widget-js/core'

const name = 'cn.widgetjs.widgets.clipboard'
// 组件标题
const title = { 'zh-CN': '剪切板' }
// 组件描述
const description = { 'zh-CN': '带搜索、编辑、标签功能的剪切板' }
// 组件关键词
const keywords = [WidgetKeyword.RECOMMEND]
// 组件路由地址
const url = '/clipboard'
// 组件关键词
const ClipboardWidget = new BackgroundWidget({
  name,
  title,
  description,
  keywords,
  lang: 'zh-CN',
  previewImage: '/images/preview_sit_reminder.png',
  path: url,
})

export default ClipboardWidget
