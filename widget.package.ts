import { WidgetPackage } from '@widget-js/core'

export default new WidgetPackage({
  remote: {
    entry: 'https://widgetjs.cn/clipboard',
    base: '/clipboard',
    hostname: 'widgetjs.cn'
  },
  author: 'Neo Fu',
  description: {
    'zh-CN': '提供剪切板便捷功能',
  },
  hash: true,
  homepage: '',
  entry: 'index.html',
  name: 'cn.widgetjs.widgets.clipboard',
  title: {
    'zh-CN': '剪切板组件包',
  },
  remoteEntry: 'https://widgetjs.cn/clipboard',
  requiredAppVersion: '24.2.15',
  development: true,
  devOptions: {
    folder: './src/widgets/',
    route: true,
    devUrl: 'http://localhost:5173/clipboard',
  },
})
