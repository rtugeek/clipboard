import { BackgroundWidget, WidgetKeyword } from '@widget-js/core';

// 组件标题
const ClipboardWidget = new BackgroundWidget({
  name: 'cn.widgetjs.widgets.clipboard.list',
  title: { 'zh-CN': '剪切板' },
  description: { 'zh-CN': '带搜索、收藏功能的剪切板' },
  keywords: [WidgetKeyword.RECOMMEND],
  lang: 'zh-CN',
  previewImage: '/images/preview_clipboard.png',
  path: '/clipboard',
});

export default ClipboardWidget;
