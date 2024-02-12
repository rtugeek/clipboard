import { createRouter, createWebHashHistory } from 'vue-router'
import WidgetRouter from '../widgets/widget-router'
import Settings from '@/widgets/clipboard/layout/Settings.vue'
import ClipboardList from '@/widgets/clipboard/layout/ClipboardList.vue'
import ClipboardView from '@/widgets/clipboard/ClipboardView.vue'

const router = createRouter({
  history: createWebHashHistory('clipboard'),
  routes: [
    {
      path: '/',
      redirect: '/clipboard/',
    },
    {
      path: '/clipboard',
      name: 'index',
      component: ClipboardView,
      children: [
        {
          path: '',
          name: 'clipboard',
          component: ClipboardList,
        },
        {
          path: 'settings',
          name: 'settings',
          component: Settings,
        },
      ],
    },
    ...WidgetRouter,
  ],
})

export default router
