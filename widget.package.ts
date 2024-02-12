import { WidgetPackage } from '@widget-js/core'

export default new WidgetPackage({
  author: 'Neo Fu',
  description: {
    'zh-CN': '提供剪切板便捷功能',
  },
  hash: true,
  homepage: '',
  entry: '/',
  name: 'cn.widgetjs.widgets.clipboard',
  title: {
    'zh-CN': '剪切板组件包',
  },
  remoteEntry: 'https://rtugeek.gitee.io/clipboard',
  version: '1.0.0',
  development: true,
  devOptions: {
    folder: './src/widgets/',
    route: true,
    devUrl: 'http://localhost:5173/clipboard',
  },
})
