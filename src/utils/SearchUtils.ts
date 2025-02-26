import { BrowserWindowApi } from '@widget-js/core'
import type { SearchEngine } from '@/widgets/search/model/ClipboardAction'
import { searchActionList } from '@/widgets/search/model/ClipboardAction'

export class SearchUtils {
  static search(se: SearchEngine, keyword: string) {
    const platform = searchActionList.find(item => item.value === se)
    if (platform) {
      const url = platform.url.replace('@{clipboard}', keyword)
      BrowserWindowApi.openUrl(url, { external: true })
    }
  }
}
