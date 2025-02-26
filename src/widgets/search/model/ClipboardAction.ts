import type { BrowserWindowOptions } from '@widget-js/core'
import { BrowserWindowApi } from '@widget-js/core'

export type SearchEngine = 'bing' | 'google' | 'baidu'

export type ClipboardActionType = 'link' | 'chat' | 'one-time-chat'
export interface ClipboardAction {
  title: string
  url: string
  value: string
  icon: string
}

export interface ClipboardWindowAction extends ClipboardAction {
  attachAiConfig?: boolean
  browserWindowConfig?: BrowserWindowOptions
}

export const searchActionList: ClipboardAction[] = [
  {
    title: 'Google',
    url: 'https://www.google.com/search?q=@{clipboard}',
    value: 'google',
    icon: './images/logo/google.png',
  },
  {
    title: 'Bing',
    url: 'https://cn.bing.com/search?q=@{clipboard}',
    value: 'bing',
    icon: './images/logo/bing.png',
  },
  {
    title: '百度',
    url: 'https://www.baidu.com/s?wd=@{clipboard}',
    value: 'baidu',
    icon: './images/logo/baidu.png',
  },
]

export function search(se: SearchEngine, keyword: string) {
  const platform = searchActionList.find(item => item.value === se)
  if (platform) {
    const url = platform.url.replace('@{clipboard}', keyword)
    BrowserWindowApi.openUrl(url, { external: true })
  }
}
