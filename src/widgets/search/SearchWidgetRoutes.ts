import type { RouteRecordRaw } from 'vue-router'
import ClipboardSearchWidget from './ClipboardSearch.widget'

const path = ClipboardSearchWidget.path
const name = ClipboardSearchWidget.name

const configUrl = ClipboardSearchWidget.configPagePath!

const SearchWidgetRoutes: RouteRecordRaw[] = [
  {
    path,
    name: `${name}`,
    component: () => import(/* webpackChunkName: "com.wisdom.widgets.clipboard" */ './SearchWidgetView.vue'),
  },
  {
    path: configUrl,
    name: `${name}.config`,
    component: () => import(/* webpackChunkName: "com.wisdom.widgets.clipboard.config" */ './SearchConfigView.vue'),
  },
]

export default SearchWidgetRoutes
