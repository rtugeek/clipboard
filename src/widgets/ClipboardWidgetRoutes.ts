import type { RouteRecordRaw } from 'vue-router'
import ClipboardWidget from '@/widgets/Clipboard.widget'

const url = ClipboardWidget.path
const name = ClipboardWidget.name


const ClipboardWidgetRoutes: RouteRecordRaw[] = [
  {
    path: url,
    name: `${name}`,
    component: () => import('../views/HomeView.vue'),
  },
]

export default ClipboardWidgetRoutes
